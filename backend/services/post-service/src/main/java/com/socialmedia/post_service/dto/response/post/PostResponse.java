package com.socialmedia.post_service.dto.response.post;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String id;
    String authenId;
    String caption;
    List<String> mediaUrls;
    Integer likesCount;
    Integer commentsCount;
    String privacy;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
