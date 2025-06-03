package com.socialmedia.post_service.controller;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.GetPostByPostIdRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.post.PostDeleteResponse;
import com.socialmedia.post_service.dto.response.post.PostListResponse;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.service.PostService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    PostService postService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PostResponse> createPost(
            @RequestBody @Valid CreatePostRequest request,
            @AuthenticationPrincipal Jwt principal
    ) {
        String authenId = principal.getSubject();
        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Post created successfully")
                .result(postService.createPost(authenId, request))
                .build();
    }

    @PutMapping("/update/{postId}")
    public ApiResponse<PostResponse> updatePost(
            @RequestBody @Valid UpdatePostRequest request,
            @AuthenticationPrincipal Jwt principal
    ) {
        String userId = principal.getSubject();
        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post updated successfully")
                .result(postService.updatePost(userId, request))
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPostById(@RequestBody @Valid GetPostByPostIdRequest request) {
        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .result(postService.getPostById(request))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<PostListResponse> getMyPosts(
            @AuthenticationPrincipal Jwt principal,
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        String authenId = principal.getSubject();
        return ApiResponse.<PostListResponse>builder()
                .code(HttpStatus.OK.value())
                .result(postService.getPostsByAuthenId(authenId, pageable)) // Đã sửa tên phương thức
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<PostListResponse> getAllPosts(
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PostListResponse>builder()
                .code(HttpStatus.OK.value())
                .result(postService.getAllPosts(pageable))
                .build();
    }

    @DeleteMapping("/delete/{postId}")
    public ApiResponse<PostDeleteResponse> deletePost(
            @RequestBody @Valid GetPostByPostIdRequest request,
            @AuthenticationPrincipal Jwt principal
    ) {
        String authenId = principal.getSubject();
        return ApiResponse.<PostDeleteResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post deleted successfully")
                .result(postService.deletePost(request, authenId))
                .build();
    }
}