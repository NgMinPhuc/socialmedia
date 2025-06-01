package com.socialmedia.post_service.controller;

import com.socialmedia.post_service.dto.request.post.PostFilterRequest;
import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.service.PostSearchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/posts/search")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostSearchController {
    PostSearchService postSearchService;

    @PostMapping
    public ApiResponse<Page<PostResponse>> searchPosts(
            @RequestBody PostFilterRequest filterRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PostResponse> posts = postSearchService.findPostsWithFilters(filterRequest, pageable);
        
        return ApiResponse.<Page<PostResponse>>builder()
                .code(200)
                .message("Posts retrieved successfully")
                .result(posts)
                .build();
    }
    
    @GetMapping("/users/{userIds}")
    public ApiResponse<Page<PostResponse>> getPostsByUserIds(
            @PathVariable List<String> userIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PostFilterRequest filterRequest = PostFilterRequest.builder()
                .userIds(userIds)
                .build();
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PostResponse> posts = postSearchService.findPostsWithFilters(filterRequest, pageable);
        
        return ApiResponse.<Page<PostResponse>>builder()
                .code(200)
                .message("Posts retrieved successfully")
                .result(posts)
                .build();
    }
    
    @GetMapping("/date-range")
    public ApiResponse<Page<PostResponse>> getPostsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PostFilterRequest filterRequest = PostFilterRequest.builder()
                .fromDate(from)
                .toDate(to)
                .build();
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PostResponse> posts = postSearchService.findPostsWithFilters(filterRequest, pageable);
        
        return ApiResponse.<Page<PostResponse>>builder()
                .code(200)
                .message("Posts retrieved successfully")
                .result(posts)
                .build();
    }
    
    @GetMapping("/content-type/{contentType}")
    public ApiResponse<Page<PostResponse>> getPostsByContentType(
            @PathVariable String contentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PostFilterRequest filterRequest = PostFilterRequest.builder()
                .contentType(contentType)
                .build();
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PostResponse> posts = postSearchService.findPostsWithFilters(filterRequest, pageable);
        
        return ApiResponse.<Page<PostResponse>>builder()
                .code(200)
                .message("Posts retrieved successfully")
                .result(posts)
                .build();
    }
}
