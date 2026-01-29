package eu.reportincident.gateway_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "security")
public class SecurityProperties {

    private List<String> publicEndpoints = new ArrayList<>();
    private String authorizeEndpoint;
    private String authenticationEndpoint;

    // Getters and Setters
    public List<String> getPublicEndpoints() {
        return publicEndpoints;
    }

    public void setPublicEndpoints(List<String> publicEndpoints) {
        this.publicEndpoints = publicEndpoints;
    }

    public String getAuthorizeEndpoint() {
        return authorizeEndpoint;
    }

    public void setAuthorizeEndpoint(String authorizeEndpoint) {
        this.authorizeEndpoint = authorizeEndpoint;
    }

    public String getAuthenticationEndpoint() {
        return authenticationEndpoint;
    }

    public void setAuthenticationEndpoint(String authenticationEndpoint) {
        this.authenticationEndpoint = authenticationEndpoint;
    }
}