package com.socialmedia.post_service.dto.request.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommentRequest {
    private String postId;
    private String userId;
    private String content;
}
