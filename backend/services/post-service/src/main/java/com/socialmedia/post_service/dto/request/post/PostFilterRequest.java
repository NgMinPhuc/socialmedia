package com.socialmedia.post_service.dto.request.post;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostFilterRequest {
    List<String> userIds;
    String contentType;
    LocalDateTime fromDate;
    LocalDateTime toDate;
    String privacy;
    String searchQuery;
}
