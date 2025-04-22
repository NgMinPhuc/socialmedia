package com.socialmedia.user_service.dto.request;

import org.springframework.web.multipart.MultipartFile;
import lombok.*;

@Getter
@Setter
public class AvatarRequest {
    private MultipartFile file;

}
