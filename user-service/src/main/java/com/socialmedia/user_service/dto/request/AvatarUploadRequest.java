package com.socialmedia.user_service.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AvatarUploadRequest {
    private String userId;
    private MultipartFile avatar;
}
