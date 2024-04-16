package wevioo.tn.apigateway;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import wevioo.tn.apigateway.security.AuthenticationFilter;


@EnableDiscoveryClient
@SpringBootApplication
public class ApiGatewayApplication {
   @Autowired
    private AuthenticationFilter authenticationFilter;

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authentication", r -> r.path("/api/**","/uploads/**")
                       .filters(f -> f.filter(authenticationFilter))
                        .uri("http://localhost:8090/"))
                .route("email", r -> r.path("/apiEmail/**")
                       .filters(f -> f.filter(authenticationFilter))
                        .uri("http://localhost:8091/"))
                .route("sms", r -> r.path("/apiEmail/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("http://localhost:8092/"))
                .build();
    }

    @Bean
    public WebFluxConfigurer corsConfigurer() {
        return new WebFluxConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }


}
