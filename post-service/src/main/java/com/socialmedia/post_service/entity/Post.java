package com.socialmedia.post_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

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
    String userId;
    String caption;
    List<MultipartFile> files;
    @Builder.Default
    List<String> contentTypes = new ArrayList<>();
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String privacy; // "public", "friends", "private"
    List<String> listCommentId;
}