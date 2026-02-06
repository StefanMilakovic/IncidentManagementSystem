package eu.reportincident.gateway_service.filter;

import eu.reportincident.gateway_service.config.CookieProperties;
import eu.reportincident.gateway_service.config.SecurityProperties;
import eu.reportincident.gateway_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;
    private final SecurityProperties securityProperties;
    private final CookieProperties cookieProperties;

    @Value("${gateway.internal-secret}")
    private String gatewaySecret;

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            SecurityProperties securityProperties,
            CookieProperties cookieProperties) {
        this.jwtUtil = jwtUtil;
        this.securityProperties = securityProperties;
        this.cookieProperties = cookieProperties;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        ServerHttpRequest.Builder requestBuilder = exchange.getRequest().mutate()
                .header("X-Gateway-Secret", gatewaySecret);

        if (isPublicEndpoint(path, method)) {
            return chain.filter(
                    exchange.mutate().request(requestBuilder.build()).build()
            );
        }

        HttpCookie cookie = exchange.getRequest()
                .getCookies()
                .getFirst(cookieProperties.getName());

        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = cookie.getValue();

        if (!jwtUtil.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);

        requestBuilder
                .header("X-User-Email", email)
                .header("X-User-Role", role);

        return chain.filter(
                exchange.mutate().request(requestBuilder.build()).build()
        );
    }

    private boolean isPublicEndpoint(String path, HttpMethod method) {
        if (path.startsWith("/login") || path.startsWith("/oauth2")) {
            return true;
        }

        if (path.startsWith("/api/v1/auth/login") ||
                path.startsWith("/api/v1/auth/register") ||
                path.startsWith("/api/v1/auth/logout")) {
            return true;
        }

        if (path.startsWith("/api/v1/incidents/approved")) {
            return method == HttpMethod.GET;
        }

        return securityProperties.getPublicEndpoints().stream()
                .anyMatch(path::startsWith);
    }

    @Override
    public int getOrder() {
        return -100; // Visok prioritet
    }
}