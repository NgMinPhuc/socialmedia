package com.socialmedia.post_service.dto.response.post;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePostResponse {
    private Long postId;
    private Long userId;
    private String caption;
    private String mediaUrl;     // URL của ảnh hoặc video
    private String mediaType;    // IMAGE hoặc VIDEO
    private String imageBase64;  // Trường để chứa ảnh đã mã hóa base64
    private int likeCount;
    private int dislikeCount;
    private LocalDateTime updatedAt;

    public static class UpdatePostResponseBuilder {
        private Long postId;
        private Long userId;
        private String caption;
        private String mediaUrl;     // URL của ảnh hoặc video
        private String mediaType;    // IMAGE hoặc VIDEO
        private String imageBase64;  // Thêm trường imageBase64 trong builder để mã hóa ảnh
        private int likeCount;
        private int dislikeCount;
        private LocalDateTime updatedAt;

        // Builder method cho trường imageBase64
        public UpdatePostResponseBuilder imageBase64(String imageBase64) {
            this.imageBase64 = imageBase64;
            return this;
        }
    }
}
