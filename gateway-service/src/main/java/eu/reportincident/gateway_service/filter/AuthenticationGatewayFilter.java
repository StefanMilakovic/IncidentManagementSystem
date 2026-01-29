package eu.reportincident.gateway_service.filter;

import eu.reportincident.gateway_service.config.CookieProperties;
import eu.reportincident.gateway_service.config.SecurityProperties;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationGatewayFilter implements GlobalFilter, Ordered {

    private final SecurityProperties securityProperties;
    private final CookieProperties cookieProperties;
    private final WebClient.Builder webClientBuilder;

    public AuthenticationGatewayFilter(
            SecurityProperties securityProperties,
            CookieProperties cookieProperties,
            WebClient.Builder webClientBuilder) {
        this.securityProperties = securityProperties;
        this.cookieProperties = cookieProperties;
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Proveri da li je public endpoint
        if (isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        // Izvuci JWT iz cookie-a
        HttpCookie cookie = exchange.getRequest().getCookies()
                .getFirst(cookieProperties.getName());

        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = cookie.getValue();

        // Pozovi Auth-Service da validira token
        return validateToken(token)
                .flatMap(userInfo -> {
                    // Pozovi User-Service da proveri autorizaciju (ako treba)
                    return authorizeUser(userInfo, path)
                            .flatMap(authorized -> {
                                if (!authorized) {
                                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                                    return exchange.getResponse().setComplete();
                                }

                                // Dodaj user info u header
                                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                                        .header("X-User-Email", userInfo.getEmail())
                                        .header("X-User-Role", userInfo.getRole())
                                        .build();

                                return chain.filter(exchange.mutate()
                                        .request(modifiedRequest).build());
                            });
                })
                .onErrorResume(e -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }

    private boolean isPublicEndpoint(String path) {
        return securityProperties.getPublicEndpoints().stream()
                .anyMatch(path::startsWith);
    }

    private Mono<UserInfo> validateToken(String token) {
        return webClientBuilder.build()
                .post()
                .uri(securityProperties.getAuthenticationEndpoint())
                .bodyValue(new TokenRequest(token))
                .retrieve()
                .bodyToMono(UserInfo.class);
    }

    private Mono<Boolean> authorizeUser(UserInfo userInfo, String path) {
        // Opciono: pozovi user-service za detaljniju proveru
        // Za sada samo vrati true
        return Mono.just(true);
    }

    @Override
    public int getOrder() {
        return -100;
    }

    // DTO klase
    private static class TokenRequest {
        private String token;

        public TokenRequest(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }

    private static class UserInfo {
        private String email;
        private String role;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}