package com.socialmedia.api_gateway_service.controller;

import com.socialmedia.api_gateway_service.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fallback")
@Slf4j
public class FallbackController {

    @GetMapping
    public ResponseEntity<ApiResponse<String>> getFallback() {
        log.warn("Fallback endpoint called for GET request");
        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(503)
                .message("Service temporarily unavailable. Please try again later.")
                .result("GET fallback")
                .build();
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> postFallback() {
        log.warn("Fallback endpoint called for POST request");
        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(503)
                .message("Service temporarily unavailable. Please try again later.")
                .result("POST fallback")
                .build();
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
