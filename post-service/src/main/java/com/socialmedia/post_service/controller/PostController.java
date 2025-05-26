package com.socialmedia.post_service.controller;

import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(@RequestBody CreatePostRequest request) {
        PostResponse response = postService.createPost(request);
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post created successfully")
                .result(response)
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable String postId) {
        PostResponse response = postService.getPost(postId);
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<Page<PostResponse>> getPosts(
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PostResponse> posts = postService.getPosts(userId, pageable);

        return ApiResponse.<Page<PostResponse>>builder()
                .code(200)
                .message("Posts retrieved successfully")
                .result(posts)
                .build();
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(
            @PathVariable String postId,
            @RequestBody UpdatePostRequest request) {
        request.setPostId(postId);
        PostResponse response = postService.updatePost(request);
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Post deleted successfully")
                .build();
    }
}
