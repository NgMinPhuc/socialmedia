package com.socialmedia.post_service.dto.response.post;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDeleteResponse {
    boolean isSuccess;
    String message;
}