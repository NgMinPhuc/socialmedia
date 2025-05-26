package com.socialmedia.post_service.dto.request.comment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteCommentRequest {
    private String commentId;
}