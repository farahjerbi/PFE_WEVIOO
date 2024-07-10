package wevioo.tn.apigateway.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@RefreshScope
@Component
public class AuthenticationFilter implements GatewayFilter {

    @Autowired
    private RouteValidator validator;
    @Autowired
    private JwtGenerator jwtUtils;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (!validator.isSecured.test(request)) {
            return chain.filter(exchange);
        }

        if (authMissing(request)) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Authorization header is missing");
        }

        final String authorizationHeader = request.getHeaders().getFirst("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Invalid Authorization header");
        }

        final String token = authorizationHeader.substring(7).trim();

        try {
            boolean isValidToken = jwtUtils.validateToken(token);

            if (!isValidToken) {
                return onError(exchange, HttpStatus.UNAUTHORIZED, "Invalid JWT token");
            }
        } catch (Exception e) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "JWT token validation error");
        }

        return chain.filter(exchange)
                .onErrorResume(e -> handleServiceException(exchange, e));
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    private boolean authMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }

    private Mono<Void> handleServiceException(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();
        if (ex instanceof WebClientResponseException) {
            WebClientResponseException we = (WebClientResponseException) ex;
            response.setStatusCode(HttpStatus.valueOf(we.getStatusCode().value()));
            response.getHeaders().putAll(we.getHeaders());
            return response.writeWith(Mono.just(response.bufferFactory().wrap(we.getResponseBodyAsByteArray())));
        } else {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            byte[] bytes = "Internal server error".getBytes(StandardCharsets.UTF_8);
            DataBuffer buffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Mono.just(buffer));
        }
    }
}