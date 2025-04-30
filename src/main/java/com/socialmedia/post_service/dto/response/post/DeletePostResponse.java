package com.socialmedia.post_service.dto.response.post;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeletePostResponse {
    private Long postId;
    private String message; // Thông báo về việc xóa thành công
}

