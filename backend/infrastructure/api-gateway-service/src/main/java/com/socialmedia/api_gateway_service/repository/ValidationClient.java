package com.socialmedia.api_gateway_service.repository;

import com.socialmedia.api_gateway_service.dto.request.ValidateTokenRequest;
import com.socialmedia.api_gateway_service.dto.response.ApiResponse;
import com.socialmedia.api_gateway_service.dto.response.ValidateTokenResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface ValidationClient {
    @PostExchange(url = "/auth/validateToken", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<ValidateTokenResponse>> validateToken(@RequestBody ValidateTokenRequest request);
}
