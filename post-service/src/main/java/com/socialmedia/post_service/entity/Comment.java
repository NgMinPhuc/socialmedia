package com.socialmedia.post_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String commentId;
    
    @DBRef(lazy = true)
    @org.springframework.data.mongodb.core.index.Indexed
    private Post post;
    
    @org.springframework.data.mongodb.core.index.Indexed
    private String userId;
    
    @jakarta.validation.constraints.NotBlank(message = "Content cannot be empty")
    @jakarta.validation.constraints.Size(max = 1000, message = "Content cannot exceed 1000 characters")
    private String content;
    
    @Builder.Default
    @CreatedDate
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    @LastModifiedDate
    private LocalDateTime updatedAt = LocalDateTime.now();
}