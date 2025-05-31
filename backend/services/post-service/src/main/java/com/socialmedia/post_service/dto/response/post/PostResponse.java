package com.socialmedia.post_service.dto.response.post;

import com.socialmedia.post_service.dto.response.UserDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    List<String> files; // Changed from MultipartFile to String URLs
    List<String> contentTypes = new ArrayList<>();
    String privacy;
    List<String> listCommentId;
    Integer likesCount;
    Integer commentsCount;
    UserDTO author; // Added user information
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
