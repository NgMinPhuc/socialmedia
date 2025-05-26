package com.socialmedia.post_service.controller;

import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.request.comment.CreateCommentRequest;
import com.socialmedia.post_service.dto.request.comment.DeleteCommentRequest;
import com.socialmedia.post_service.dto.request.comment.GetCommentRequest;
import com.socialmedia.post_service.dto.request.comment.UpdateCommentRequest;
import com.socialmedia.post_service.dto.response.comment.CommentResponse;
import com.socialmedia.post_service.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CommentController {
    CommentService commentService;

    @PostMapping()
    public ApiResponse<CommentResponse> createComment(@RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(request);
        return ApiResponse.<CommentResponse>builder()
                .code(200)
                .message("Comment created successfully")
                .result(response)
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<Page<CommentResponse>> getCommentsByPostId(
            @RequestBody GetCommentRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<CommentResponse> comments = commentService.getCommentsByPostId(request, pageable);

        return ApiResponse.<Page<CommentResponse>>builder()
                .code(200)
                .message("Comments retrieved successfully")
                .result(comments)
                .build();
    }

    @PutMapping("/{commentId}")
    public ApiResponse<CommentResponse> updateComment(@RequestBody UpdateCommentRequest request) {
        CommentResponse response = commentService.updateComment(request);
        return ApiResponse.<CommentResponse>builder()
                .code(200)
                .message("Comment updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@RequestBody DeleteCommentRequest request) {
        commentService.deleteComment(request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Comment deleted successfully")
                .result(null)
                .build();
    }
}