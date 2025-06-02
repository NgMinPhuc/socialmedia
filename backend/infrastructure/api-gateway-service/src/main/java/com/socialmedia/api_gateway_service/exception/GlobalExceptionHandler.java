package com.socialmedia.api_gateway_service.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.socialmedia.api_gateway_service.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

@Component
@Order(-2)
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler implements WebExceptionHandler {
    
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        log.error("Global exception handler caught: ", ex);
        
        var response = exchange.getResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        response.getHeaders().add("Content-Type", MediaType.APPLICATION_JSON_VALUE);
        
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .code(500)
                .message("Internal server error: " + ex.getMessage())
                .build();
        
        String body;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            body = "{\"code\":500,\"message\":\"Internal server error\"}";
        }
        
        var dataBuffer = response.bufferFactory().wrap(body.getBytes());
        return response.writeWith(Mono.just(dataBuffer));
    }
}
