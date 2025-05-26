package com.socialmedia.post_service.client;

import com.socialmedia.post_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service", url = "${app.auth-service.url}")
public interface AuthClient {
    
    @GetMapping("/api/v1/auth/validate")
    ApiResponse<TokenValidationDTO> validateToken(@RequestHeader("Authorization") String token);
}
