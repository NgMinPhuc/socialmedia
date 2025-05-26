package com.socialmedia.post_service.dto.response.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private String commentId;
    private String postId;
    private String userId;
    private String content;
    private String createdAt;
    private String updatedAt;
}
