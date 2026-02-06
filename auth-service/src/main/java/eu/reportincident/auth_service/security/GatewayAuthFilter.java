package eu.reportincident.auth_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GatewayAuthFilter extends OncePerRequestFilter {

    @Value("${gateway.internal-secret}")
    private String gatewaySecret;

    private static final List<String> HEALTH_CHECK_PATHS = Arrays.asList(
            "/actuator/health",
            "/actuator/info"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        if (isHealthCheckEndpoint(requestUri)) {
            filterChain.doFilter(request, response);
            return;
        }

        String secretHeader = request.getHeader("X-Gateway-Secret");

        if (secretHeader == null || !secretHeader.equals(gatewaySecret)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Direct access forbidden. Use gateway at localhost:8080\"}");
            response.getWriter().flush();
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isHealthCheckEndpoint(String uri) {
        return HEALTH_CHECK_PATHS.stream().anyMatch(uri::startsWith);
    }
}