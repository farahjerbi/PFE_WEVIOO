package wevioo.tn.apigateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {
    public static final List<String> openEndpoints = List.of(
            "/auth/register",
            "/eureka",
            "/auth/verify",
            "/api/users/forgotPassword",
            "uploads",
            "uploadsPush",
            "/api/auth/",
            "/api/search"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openEndpoints.stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));

}