package eu.reportincident.moderation_service.config;

//ovo ce mi trebati
// Konfiguracija za WebClient sa LoadBalanced anotacijom, potrebna kad
// moderation-service poziva druge mikroservise preko Eureka

/*
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}



 */