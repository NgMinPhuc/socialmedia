package com.socialmedia.post_service.controller;

import com.socialmedia.post_service.dto.request.comment.CreateCommentRequest;
import com.socialmedia.post_service.dto.request.comment.DeleteCommentRequest;
import com.socialmedia.post_service.dto.request.comment.UpdateCommentRequest;
import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.comment.CreateCommentResponse;
import com.socialmedia.post_service.dto.response.comment.DeleteCommentResponse;
import com.socialmedia.post_service.dto.response.comment.UpdateCommentResponse;
import com.socialmedia.post_service.entity.Comment;
import com.socialmedia.post_service.service.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Tạo bình luận mới
    @PostMapping("/createComment")
    public ResponseEntity<ApiResponse<CreateCommentResponse>> createComment(
            @RequestParam("postId") Long postId,
            @RequestParam("userId") Long userId,
            @RequestParam("content") String content
    ) throws IOException {
        CreateCommentRequest request = CreateCommentRequest.builder()
                .postId(postId)
                .userId(userId)
                .content(content)
                .build();

        Comment comment = commentService.createComment(request);

        CreateCommentResponse response = CreateCommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.<CreateCommentResponse>builder()
                .code(200)
                .message("Comment created successfully")
                .result(response)
                .build());
    }

    // Lấy bình luận theo ID
    @GetMapping("/getComment/{commentId}")
    public ResponseEntity<ApiResponse<CreateCommentResponse>> getComment(@PathVariable Long commentId) {
        // Lấy bình luận từ service
        Optional<Comment> optionalComment = Optional.ofNullable(commentService.getComment(commentId));

        if (!optionalComment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<CreateCommentResponse>builder()
                            .code(404)
                            .message("Comment not found")
                            .build());
        }

        Comment comment = optionalComment.get();

        CreateCommentResponse response = CreateCommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.<CreateCommentResponse>builder()
                .code(200)
                .message("Fetched comment successfully")
                .result(response)
                .build());
    }

    // Cập nhật bình luận
    @PutMapping("/updateComment/{commentId}")
    public ResponseEntity<ApiResponse<UpdateCommentResponse>> updateComment(
            @PathVariable Long commentId,
            @RequestParam("content") String content
    ) throws IOException {
        // Lấy bình luận từ DB
        Comment comment = commentService.getComment(commentId);

        if (comment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<UpdateCommentResponse>builder()
                            .code(404)
                            .message("Comment not found")
                            .build());
        }

        // Tạo request update bình luận
        UpdateCommentRequest request = UpdateCommentRequest.builder()
                .content(content)
                .build();

        // Cập nhật bình luận thông qua service
        comment = commentService.updateComment(commentId, request);

        // Tạo response để trả về
        UpdateCommentResponse response = UpdateCommentResponse.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .updatedAt(comment.getUpdatedAt())
                .build();

        // Trả về kết quả thành công
        return ResponseEntity.ok(ApiResponse.<UpdateCommentResponse>builder()
                .code(200)
                .message("Comment updated successfully")
                .result(response)
                .build());
    }

    // Xoá bình luận
    @DeleteMapping("/deleteComment/{commentId}")
    public ResponseEntity<ApiResponse<DeleteCommentResponse>> deleteComment(@PathVariable Long commentId) {
        DeleteCommentRequest request = new DeleteCommentRequest(commentId);
        commentService.deleteComment(request);

        DeleteCommentResponse response = DeleteCommentResponse.builder()
                .commentId(commentId)
                .message("Comment deleted successfully")
                .build();

        return ResponseEntity.ok(ApiResponse.<DeleteCommentResponse>builder()
                .code(200)
                .message("Deleted")
                .result(response)
                .build());
    }

    // Thích bình luận
    @PostMapping("/likeComment/{commentId}")
    public ResponseEntity<ApiResponse<String>> likeComment(@PathVariable Long commentId) {
        commentService.likeComment(commentId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(200)
                .message("Liked comment")
                .result("Success")
                .build());
    }

    // Không thích bình luận
    @PostMapping("/dislikeComment/{commentId}")
    public ResponseEntity<ApiResponse<String>> dislikeComment(@PathVariable Long commentId) {
        commentService.dislikeComment(commentId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(200)
                .message("Disliked comment")
                .result("Success")
                .build());
    }

    // Lấy tất cả bình luận của một bài viết
    @GetMapping("/getCommentsByPost/{postId}")
    public ResponseEntity<ApiResponse<List<CreateCommentResponse>>> getCommentsByPost(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);

        List<CreateCommentResponse> responses = comments.stream().map(comment -> 
            CreateCommentResponse.builder()
                    .id(comment.getId())
                    .userId(comment.getUserId())
                    .content(comment.getContent())
                    .likeCount(comment.getLikeCount())
                    .dislikeCount(comment.getDislikeCount())
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .build()
        ).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<CreateCommentResponse>>builder()
                .code(200)
                .message("Fetched comments successfully")
                .result(responses)
                .build());
    }
}
