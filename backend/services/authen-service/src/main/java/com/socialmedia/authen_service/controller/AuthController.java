package com.socialmedia.authen_service.controller;

import com.nimbusds.jose.JOSEException;
import com.socialmedia.authen_service.dto.ApiResponse;
import com.socialmedia.authen_service.dto.request.*;
import com.socialmedia.authen_service.dto.response.*;
import com.socialmedia.authen_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.UUID;

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
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ApiResponse.<RegisterResponse>builder()
                .code(200)
                .message("User registered successfully")
                .result(response)
                .build();
    }


    @PostMapping("/refreshToken")
    public ApiResponse<RefreshResponse> refresh(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        RefreshResponse response = authService.refreshToken(request);
        return ApiResponse.<RefreshResponse>builder()
                .code(200)
                .result(response)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<LogoutResponse> logout() throws ParseException, JOSEException {
        return null;
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
    public ApiResponse<ChangePasswordResponse> changePassword(
            @AuthenticationPrincipal Jwt principal,
            @RequestBody @Valid ChangePasswordRequest request
    ) throws ParseException, JOSEException {

        UUID authenId = UUID.fromString(principal.getSubject());

        ChangePasswordResponse response = authService.changePassword(authenId, request);
        return ApiResponse.<ChangePasswordResponse>builder()
                .code(200)
                .result(response)
                .build();
    }
}