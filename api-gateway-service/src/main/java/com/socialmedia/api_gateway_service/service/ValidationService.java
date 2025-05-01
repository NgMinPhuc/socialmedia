package com.socialmedia.api_gateway_service.service;

import com.socialmedia.api_gateway_service.dto.request.ValidateTokenRequest;
import com.socialmedia.api_gateway_service.dto.response.ApiResponse;
import com.socialmedia.api_gateway_service.dto.response.ValidateTokenResponse;
import com.socialmedia.api_gateway_service.repository.ValidationClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ValidationService {
    ValidationClient validationClient;

    public Mono<ApiResponse<ValidateTokenResponse>> validateToken(String token) {
        return validationClient.validateToken(ValidateTokenRequest.builder()
                        .token(token)
                .build());
    }
}