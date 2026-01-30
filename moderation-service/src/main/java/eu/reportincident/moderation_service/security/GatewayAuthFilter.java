package eu.reportincident.moderation_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class GatewayAuthFilter extends OncePerRequestFilter {

    @Value("${gateway.internal-secret}")
    private String gatewaySecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String secretHeader = request.getHeader("X-Gateway-Secret");

        if (secretHeader == null || !secretHeader.equals(gatewaySecret)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Direct access to microservices is forbidden");
            return;
        }

        filterChain.doFilter(request, response);
    }
}