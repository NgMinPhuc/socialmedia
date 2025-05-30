package com.socialmedia.api_gateway_service.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.socialmedia.api_gateway_service.dto.response.ApiResponse;
import com.socialmedia.api_gateway_service.service.ValidationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {
    ValidationService validationService;
    ObjectMapper objectMapper;    @NonFinal
    private String[] publicEndpoints = {
            "/auth/login",
            "/auth/register", 
            "/auth/refreshToken",
            "/auth/validateToken",
            "/health",
            "/auth/health",
            "/users/health",
            "/posts/health",
            "/search/health",
            "/notifications/health", 
            "/chat/health",
            "/actuator/.*"
    };

    @Value("${app.api-prefix}")
    @NonFinal
    private String apiPrefix;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Enter authentication filter....");

        if (isPublicEndpoint(exchange.getRequest())) return chain.filter(exchange);

        List<String> authHeader = exchange.getRequest().getHeaders().get("Authorization");
        if (CollectionUtils.isEmpty(authHeader)) return unauthenticated(exchange.getResponse());

        String token = authHeader.getFirst().replace("Bearer ", "");
        log.info("Token: {}", token);

        return validationService.validateToken(token)
                .flatMap(validateTokenResponse -> {
                    if (validateTokenResponse.getResult().isValid())
                        return chain.filter(exchange);
                    else
                        return unauthenticated(exchange.getResponse());
                })
                .onErrorResume(throwable -> {
                    log.error("Error validating token", throwable);
                    return unauthenticated(exchange.getResponse());
                });
    }


    @Override
    public int getOrder() {
        return -1;
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        log.info("Checking path: {} against patterns with prefix: {}", path, apiPrefix);
        
        // For API path like "/api/v1/auth/register"
        // We need to check it against patterns like "/auth/register" with prefix "api/v1" 
        boolean isPublic = false;
        
        for (String endpoint : publicEndpoints) {
            String fullPattern = "/" + apiPrefix + endpoint;
            String plainPattern = fullPattern.replace(".*", "");
            log.info("Testing if path '{}' starts with '{}'", path, plainPattern);
            if (path.startsWith(plainPattern)) {
                isPublic = true;
                break;
            }
        }
        
        log.info("Path '{}' is public: {}", path, isPublic);
        return isPublic;
    }



    Mono<Void> unauthenticated(ServerHttpResponse response){
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(1401)
                .message("Unauthenticated")
                .build();

        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return response.writeWith(
                Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}