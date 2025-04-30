package com.socialmedia.post_service.dto.request.post;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeletePostRequest {

    private Long postId;  // ID bài post cần xóa
}

