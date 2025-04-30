package com.socialmedia.post_service.dto.request.post;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePostRequest {

    private String caption;  // Cập nhật nội dung caption của bài post
    private MultipartFile file; // File mới nếu muốn cập nhật media
}

