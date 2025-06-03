package com.socialmedia.user_service.controller;

import com.socialmedia.user_service.dto.request.UserProfileCreationRequest;
import com.socialmedia.user_service.dto.request.UserProfileUpdationRequest;
import com.socialmedia.user_service.dto.response.ApiResponse;
import com.socialmedia.user_service.dto.response.UserProfileResponse;
import com.socialmedia.user_service.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {
    UserProfileService userProfileService;

    @PostMapping("/create")
    public ApiResponse<UserProfileResponse> createUserProfile(@RequestBody UserProfileCreationRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .message("User profile created successfully")
                .result(userProfileService.createUserProfile(request))
                .build();
    }

    @PutMapping("/update")
    public ApiResponse<UserProfileResponse> updateUserProfile( @AuthenticationPrincipal Jwt principal, @RequestBody @Valid UserProfileUpdationRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .message("User profile updated successfully")
                .result(userProfileService.updateUserProfile(request, principal))
                .build();
    }


    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile(@AuthenticationPrincipal Jwt principal) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .result(userProfileService.getMyProfile(principal))
                .build();
    }
}
