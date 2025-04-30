package com.socialmedia.post_service.dto.response.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteCommentResponse {
    private Long commentId;      // ID của bình luận đã xoá
    private String message;      // Thông báo về hành động xoá bình luận
}

