package com.socialmedia.post_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {

    @Id
    String postId;
    String authenId;
    String caption;
    @Builder.Default
    List<String> mediaUrls = new ArrayList<>();
    @Builder.Default
    Integer likesCount = 0;
    @Builder.Default
    Integer commentsCount = 0;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String privacy;
}