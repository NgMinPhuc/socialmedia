package com.socialmedia.user_service.controller;

import com.socialmedia.user_service.dto.request.AvatarRequest;
import com.socialmedia.user_service.dto.request.UserCreationRequest;
import com.socialmedia.user_service.dto.request.UserUpdateRequest;
import com.socialmedia.user_service.dto.response.ApiResponse;
import com.socialmedia.user_service.entity.User;
import com.socialmedia.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // Tạo người dùng
    @PostMapping("/createUsers")
    public ApiResponse<User> createUser(@RequestBody UserCreationRequest request) {
        User createdUser = userService.createUser(request);
        return ApiResponse.<User>builder()
                .code(201)
                .message("User created successfully")
                .result(createdUser)
                .build();
    }

    // Lấy người dùng theo ID
    @GetMapping("/getUser/{userId}")
    public ApiResponse<User> getUser(@PathVariable String userId) {
        User user = userService.getUser(userId);
        return ApiResponse.<User>builder()
                .code(200)
                .result(user)
                .build();
    }

    // Cập nhật người dùng
    @PutMapping("/updateUser/{userId}")
    public ApiResponse<User> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        User updatedUser = userService.updateUser(userId, request);
        return ApiResponse.<User>builder()
                .code(200)
                .message("User updated successfully")
                .result(updatedUser)
                .build();
    }

    // Tải lên hình ảnh
    @PostMapping("/avatarUpload/{id}")
    public ApiResponse<String> uploadAvatar(@PathVariable String id, @ModelAttribute AvatarRequest avatarRequest) {
        try {
            String avatarUrl = userService.uploadAvatar(id, avatarRequest);
            return ApiResponse.<String>builder()
                    .code(200)
                    .message("Avatar uploaded successfully")
                    .result(avatarUrl)
                    .build();
        } catch (IOException e) {
            return ApiResponse.<String>builder()
                    .code(500)
                    .message("Error uploading avatar: " + e.getMessage())
                    .build();
        }
    }

    // Cập nhật hình ảnh
    @PutMapping("/avatarupdate /{id}")
    public ApiResponse<String> updateAvatar(@PathVariable String id, @ModelAttribute AvatarRequest avatarRequest) {
        try {
            String avatarUrl = userService.updateAvatar(id, avatarRequest);
            return ApiResponse.<String>builder()
                    .code(200)
                    .message("Avatar updated successfully")
                    .result(avatarUrl)
                    .build();
        } catch (IOException e) {
            return ApiResponse.<String>builder()
                    .code(500)
                    .message("Error updating avatar: " + e.getMessage())
                    .build();
        }
    }

    // Xóa hình ảnh
    @DeleteMapping("/avatarDelete/{id}")
    public ApiResponse<Void> deleteAvatar(@PathVariable String id) {
        userService.deleteAvatar(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Avatar deleted successfully")
                .build();
    }

    // Lấy hình ảnh
    @GetMapping("/avatarGet/{id}")
    public ApiResponse<String> getAvatar(@PathVariable String id) {
        String avatarUrl = userService.getAvatar(id);
        return ApiResponse.<String>builder()
                .code(200)
                .result(avatarUrl)
                .build();
    }
}