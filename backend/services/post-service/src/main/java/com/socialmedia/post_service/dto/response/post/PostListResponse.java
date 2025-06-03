package com.socialmedia.post_service.dto.response.post;

import com.socialmedia.post_service.dto.response.post.PostResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostListResponse {
    List<PostResponse> posts;
    Integer page;
    Integer size;
    Long totalElements;
    Integer totalPages;
    boolean last;
}