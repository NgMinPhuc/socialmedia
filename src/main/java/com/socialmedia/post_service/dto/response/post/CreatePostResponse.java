package com.socialmedia.post_service.dto.response.post;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostResponse {
    private Long id;
    private Long userId;
    private String caption;
    private String mediaUrl;     // URL của ảnh hoặc video
    private String mediaType;    // IMAGE hoặc VIDEO
    private String imageBase64;  // Added field to hold the Base64 encoded image
    private int likeCount;
    private int dislikeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class CreatePostResponseBuilder {
        private Long id;
        private Long userId;
        private String caption;
        private String mediaUrl;     // URL của ảnh hoặc video
        private String mediaType;    // IMAGE hoặc VIDEO
        private String imageBase64;  // Added field in builder for Base64 image
        private int likeCount;
        private int dislikeCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        // Builder method for imageBase64 field
        public CreatePostResponseBuilder imageBase64(String imageBase64) {
            this.imageBase64 = imageBase64;
            return this;
        }
    }
}


