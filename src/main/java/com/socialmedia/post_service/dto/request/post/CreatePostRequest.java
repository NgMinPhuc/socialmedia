package com.socialmedia.post_service.dto.request.post;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequest {

    private Long userId;  // ID người dùng tạo bài post
    private String caption;  // Nội dung caption của bài post
    private MultipartFile file; // file ảnh hoặc video từ máy người dùng
}




