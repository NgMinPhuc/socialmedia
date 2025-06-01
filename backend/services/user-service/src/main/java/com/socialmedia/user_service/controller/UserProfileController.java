package com.socialmedia.user_service.controller;

import com.socialmedia.user_service.dto.request.AvatarUploadRequest;
import com.socialmedia.user_service.dto.request.UserProfileCreationRequest;
import com.socialmedia.user_service.dto.request.UserProfileUpdationRequest;
import com.socialmedia.user_service.dto.response.ApiResponse;
import com.socialmedia.user_service.dto.response.UserProfileResponse;
import com.socialmedia.user_service.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {
    UserProfileService userProfileService;
    
    @PostMapping("/avatar")
    public ApiResponse<UserProfileResponse> uploadAvatar(
            @ModelAttribute @Valid AvatarUploadRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .message("Avatar uploaded successfully")
                .result(userProfileService.updateAvatar(request))
                .build();
    }
    
    @GetMapping("/{userId}/avatar")
    public ResponseEntity<byte[]> getAvatar(@PathVariable String userId) {
        byte[] avatar = userProfileService.getAvatar(userId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(avatar);
    }

    @PostMapping("/create")
    public ApiResponse<UserProfileResponse> createUserProfile(@RequestBody @Valid UserProfileCreationRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .message("User profile created successfully")
                .result(userProfileService.createUserProfile(request))
                .build();
    }

    @PutMapping("/update")
    public ApiResponse<UserProfileResponse> updateUserProfile(@RequestBody @Valid UserProfileUpdationRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .message("User profile updated successfully")
                .result(userProfileService.updateUserProfile(request))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserProfileResponse> getUserProfile(@PathVariable String userId) {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .result(userProfileService.getUserProfile(userId))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.<UserProfileResponse>builder()
                .code(200)
                .result(userProfileService.getMyProfile())
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<UserProfileResponse>> getAllUserProfile() {
        return ApiResponse.<List<UserProfileResponse>>builder()
                .code(200)
                .result(userProfileService.getAllUserProfile())
                .build();
    }

    @PostMapping("/unfollow/{id}")
    public ApiResponse<Void> unfollowUser(@PathVariable String id) {
        userProfileService.unfollowUser(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Unfollowed user successfully")
                .build();
    }

    @PostMapping("/follow/{id}")
    public ApiResponse<Void> followUser(@PathVariable String id) {
        userProfileService.followUser(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Followed user successfully")
                .build();
    }
}
