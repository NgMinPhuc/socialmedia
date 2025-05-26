package com.socialmedia.post_service.dto.response.post;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String postId;
    String userId;
    String caption;
    List<MultipartFile> files;
    List<String> contentTypes = new ArrayList<>();
    String privacy;
    List<String> listCommentId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
