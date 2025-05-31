package com.socialmedia.search_service.dto;

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
public class PostDTO {
    String postId;
    String userId;
    String caption;
    List<String> files;
    @Builder.Default
    List<String> contentTypes = new ArrayList<>();
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String privacy;
    List<String> listCommentId;
}