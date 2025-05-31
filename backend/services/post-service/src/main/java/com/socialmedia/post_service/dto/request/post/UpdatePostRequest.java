package com.socialmedia.post_service.dto.request.post;

import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePostRequest {
    String postId;

    @Size(max = 1000, message = "Caption cannot exceed 1000 characters")
    String caption;

    List<MultipartFile> files;

    List<String> contentTypes = new ArrayList<>();

    String privacy = "public"; // "public", "friends", "private"

    LocalDateTime updatedAt;
}
