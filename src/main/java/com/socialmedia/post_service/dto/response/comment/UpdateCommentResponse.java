package com.socialmedia.post_service.dto.response.comment;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCommentResponse {
    private Long commentId;       // ID của bình luận
    private Long postId;          // ID của bài viết mà bình luận thuộc về
    private Long userId;          // ID của người dùng viết bình luận
    private String content;       // Nội dung bình luận
    private int likeCount;        // Số lượt thích
    private int dislikeCount;     // Số lượt không thích
    private LocalDateTime updatedAt;  // Thời gian cập nhật bình luận
}


