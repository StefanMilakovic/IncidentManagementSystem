package eu.reportincident.gateway_service.filter;

import eu.reportincident.gateway_service.config.CookieProperties;
import eu.reportincident.gateway_service.config.SecurityProperties;
import eu.reportincident.gateway_service.security.JwtUtil;
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

        // 1. OPTIONS requests - samo propusti (CORS preflight)
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // 2. Public endpoints - propusti bez provere JWT-a
        if (isPublicEndpoint(path, method)) {
            return chain.filter(exchange);
        }

        // 3. Izvuci JWT iz cookie-a
        HttpCookie cookie = exchange.getRequest().getCookies()
                .getFirst(cookieProperties.getName());

        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = cookie.getValue();

        // 4. Validiraj token
        if (!jwtUtil.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 5. Izvuci user informacije i dodaj u headere
        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);

        ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                .header("X-User-Email", email)
                .header("X-User-Role", role)
                .build();

        // 6. Proslijedi zahtev sa headerima
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    /**
     * Proverava da li je endpoint javan (ne zahteva autentifikaciju)
     */
    private boolean isPublicEndpoint(String path, HttpMethod method) {
        // OAuth2 login flow (Google OAuth)
        if (path.startsWith("/login") || path.startsWith("/oauth2")) {
            return true;
        }

        // Auth service endpoints
        if (path.startsWith("/api/v1/auth/login") ||
                path.startsWith("/api/v1/auth/register") ||
                path.startsWith("/api/v1/auth/logout")) {
            return true;
        }

        // GET /api/v1/incidents je public (čitanje), ostalo zahteva auth
        if (path.startsWith("/api/v1/incidents")) {
            return method == HttpMethod.GET;
        }

        // Ostali custom public endpoints iz konfiguracije
        return securityProperties.getPublicEndpoints().stream()
                .anyMatch(path::startsWith);
    }

    @Override
    public int getOrder() {
        return -100; // Visok prioritet
    }
}