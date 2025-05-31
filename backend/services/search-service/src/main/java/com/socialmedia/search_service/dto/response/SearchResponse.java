package com.socialmedia.search_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchResponse {
    List<UserSearchResult> users;
    List<PostSearchResult> posts;
    Map<String, Long> aggregations;
    long totalHits;
    int page;
    int size;
    
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserSearchResult {
        String id;
        String userId;
        String firstName;
        String lastName;
        String userName;
        LocalDate dob;
        String phoneNumber;
        String location;
        String email;
        byte[] avatar;
    }
    
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PostSearchResult {
        String postId;
        String userId;
        String caption;
        List<String> files;
        List<String> contentTypes;
        LocalDateTime createdAt;
        LocalDateTime updatedAt;
        String privacy;
        List<String> listCommentId;
    }
}
