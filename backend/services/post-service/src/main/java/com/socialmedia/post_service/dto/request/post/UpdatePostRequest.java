package com.socialmedia.post_service.dto.request.post;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePostRequest {
    String postId;
    String caption;
    List<String> mediaUrls;
    String privacy;
}
