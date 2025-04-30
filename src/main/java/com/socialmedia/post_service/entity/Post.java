package com.socialmedia.post_service.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String caption;
    private String mediaUrl;  // Đường dẫn tới hình ảnh

    public enum MediaType{
        IMAGE
    }
    private MediaType mediaType; // Kiểu dữ liệu của media (hình ảnh hoặc video)
    private int likeCount;
    private int dislikeCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
