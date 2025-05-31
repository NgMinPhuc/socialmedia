package com.socialmedia.api_gateway_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ValidateTokenResponse {
    private boolean isValid;
    private String userId;
    private String username;
}