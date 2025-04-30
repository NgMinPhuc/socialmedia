package com.socialmedia.post_service.controller;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.DeletePostRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.post.CreatePostResponse;
import com.socialmedia.post_service.dto.response.post.DeletePostResponse;
import com.socialmedia.post_service.dto.response.post.UpdatePostResponse;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Tạo bài viết mới
    @PostMapping("/createPost")
    public ResponseEntity<ApiResponse<CreatePostResponse>> createPost(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "caption", required = false) String caption,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        CreatePostRequest request = CreatePostRequest.builder()
                .userId(userId)
                .caption(caption)
                .file(file)
                .build();

        Post post = postService.createPost(request);

        String imageBase64 = encodeFileToBase64(post.getMediaUrl());

        CreatePostResponse response = CreatePostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .imageBase64(imageBase64)
                .likeCount(post.getLikeCount())
                .dislikeCount(post.getDislikeCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.<CreatePostResponse>builder()
                .code(200)
                .message("Post created successfully")
                .result(response)
                .build());
    }

    // Lấy bài viết theo ID
    @GetMapping("/getPost/{postId}")
    public ResponseEntity<ApiResponse<CreatePostResponse>> getPost(@PathVariable Long postId) {
        Post post = postService.getPost(postId);

        String imageBase64 = encodeFileToBase64(post.getMediaUrl());

        CreatePostResponse response = CreatePostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .imageBase64(imageBase64)
                .likeCount(post.getLikeCount())
                .dislikeCount(post.getDislikeCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.<CreatePostResponse>builder()
                .code(200)
                .message("Fetched post successfully")
                .result(response)
                .build());
    }

    // Cập nhật bài viết
    @PutMapping("updatePost/{postId}")
    public ResponseEntity<ApiResponse<UpdatePostResponse>> updatePost(
            @PathVariable Long postId,
            @RequestParam("caption") String caption,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        UpdatePostRequest request = UpdatePostRequest.builder()
                .caption(caption)
                .file(file)
                .build();

        Post post = postService.updatePost(postId, request);

        String imageBase64 = encodeFileToBase64(post.getMediaUrl());

        UpdatePostResponse response = UpdatePostResponse.builder()
                .postId(post.getId())
                .caption(post.getCaption())
                .imageBase64(imageBase64)
                .updatedAt(post.getUpdatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.<UpdatePostResponse>builder()
                .code(200)
                .message("Post updated successfully")
                .result(response)
                .build());
    }

// Xoá bài viết
@DeleteMapping("/deletePost/{postId}")
public ResponseEntity<ApiResponse<DeletePostResponse>> deletePost(@PathVariable Long postId) {
    postService.deletePost(postId);

    DeletePostResponse response = DeletePostResponse.builder()
            .postId(postId)
            .message("Post deleted successfully")
            .build();

    return ResponseEntity.ok(ApiResponse.<DeletePostResponse>builder()
            .code(200)
            .message("Deleted")
            .result(response)
            .build());
}


    // Thích bài viết
    @PutMapping("/likePost/{postId}")
    public ResponseEntity<ApiResponse<String>> likePost(@PathVariable Long postId) {
        postService.likePost(postId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(200)
                .message("Liked post")
                .result("Success")
                .build());
    }

    // Không thích bài viết
    @PutMapping("dislikePost/{postId}/")
    public ResponseEntity<ApiResponse<String>> dislikePost(@PathVariable Long postId) {
        postService.dislikePost(postId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(200)
                .message("Disliked post")
                .result("Success")
                .build());
    }

    // Helper để mã hoá file ảnh thành base64
    private String encodeFileToBase64(String filename) {
        if (filename == null) return null;

        try {
            byte[] fileContent = Files.readAllBytes(Paths.get("uploads/" + filename));
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (IOException e) {
            return null; // Return null if there's an error reading the file
        }
    }
}
