package com.socialmedia.authen_service.controller;

import com.nimbusds.jose.JOSEException;
import com.socialmedia.authen_service.dto.request.*;
import com.socialmedia.authen_service.dto.response.ApiResponse;
import com.socialmedia.authen_service.dto.response.LoginResponse;
import com.socialmedia.authen_service.dto.response.MessageResponse;
import com.socialmedia.authen_service.dto.response.ValidateTokenResponse;
import com.socialmedia.authen_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.<LoginResponse>builder()
                .code(200)
                .result(response)
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<MessageResponse> register(@RequestBody @Valid RegisterRequest request) {
        MessageResponse response = authService.register(request);
        return ApiResponse.<MessageResponse>builder()
                .code(200)
                .result(response)
                .build();
    }

    @PostMapping("/refreshToken")
    public ApiResponse<LoginResponse> refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        LoginResponse response = authService.refreshToken(request);
        return ApiResponse.<LoginResponse>builder()
                .code(200)
                .result(response)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authService.logout(request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Logout successful")
                .build();
    }

    @PostMapping("/validateToken")
    public ApiResponse<ValidateTokenResponse> validateToken(@RequestBody @Valid ValidateTokenRequest request) throws ParseException, JOSEException {
        ValidateTokenResponse response = authService.validateToken(request);
        return ApiResponse.<ValidateTokenResponse>builder()
                .code(200)
                .result(response)
                .build();
    }

    @PostMapping("/changePassword")
    public ApiResponse<Void> changePassword(@RequestHeader("Authorization") String token, @RequestBody @Valid ChangePasswordRequest request) throws ParseException, JOSEException {

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        authService.changePassword(token, request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Password changed successfully")
                .build();
    }
}