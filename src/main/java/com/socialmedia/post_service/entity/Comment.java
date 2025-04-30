package com.socialmedia.post_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;  // Liên kết đến bài viết mà bình luận thuộc về

    private Long userId;  // ID của người dùng đã bình luận
    private String content;  // Nội dung bình luận

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0;  // Số lượt thích

    @Column(name = "dislike_count", nullable = false)
    private int dislikeCount = 0;  // Số lượt không thích
    private LocalDateTime createdAt;  // Thời gian tạo bình luận
    private LocalDateTime updatedAt;  // Thời gian cập nhật bình luận

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
