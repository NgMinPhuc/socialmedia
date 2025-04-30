package com.socialmedia.post_service.dto.request.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommentRequest {
    private Long postId;          // ID của bài viết
    private Long userId;          // ID của người dùng
    private String content;       // Nội dung bình luận
}

