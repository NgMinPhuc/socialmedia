package com.socialmedia.post_service.dto.request.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCommentRequest {
    private String content;  // Nội dung bình luận
}
