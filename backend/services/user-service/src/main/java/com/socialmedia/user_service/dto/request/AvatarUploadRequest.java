package com.socialmedia.user_service.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class AvatarUploadRequest {
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotNull(message = "Avatar file is required")
    private MultipartFile avatar;
}
