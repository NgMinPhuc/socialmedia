package com.socialmedia.post_service.service;

import java.time.LocalDateTime;

import com.socialmedia.post_service.dto.request.comment.GetCommentRequest;
import com.socialmedia.post_service.dto.response.comment.CommentResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.socialmedia.post_service.dto.request.comment.CreateCommentRequest;
import com.socialmedia.post_service.dto.request.comment.UpdateCommentRequest;
import com.socialmedia.post_service.dto.request.comment.DeleteCommentRequest;
import com.socialmedia.post_service.entity.Comment;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.exception.CommentNotFoundException;
import com.socialmedia.post_service.exception.PostNotFoundException;
import com.socialmedia.post_service.repository.CommentRepository;
import com.socialmedia.post_service.repository.PostRepository;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CommentService {
    CommentRepository commentRepository;
    PostRepository postRepository;

    public CommentResponse createComment(CreateCommentRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + request.getPostId()));

        Comment comment = Comment.builder()
                .post(post)
                .userId(request.getUserId())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        comment = commentRepository.save(comment);

        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt().toString())
                .updatedAt(comment.getUpdatedAt().toString())
                .build();
    }

    public Comment getComment(String commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + commentId));
    }

    public CommentResponse updateComment(UpdateCommentRequest request) {
        Comment comment = getComment(request.getCommentId());

        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        comment = commentRepository.save(comment);

        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .updatedAt(comment.getUpdatedAt().toString())
                .build();
    }

    public void deleteComment(DeleteCommentRequest request) {
        Comment comment = getComment(request.getCommentId());
        commentRepository.delete(comment);
    }

    public Page<CommentResponse> getCommentsByPostId(GetCommentRequest request, Pageable pageable) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + request.getPostId()));

        Page<Comment> comments = commentRepository.findByPostOrderByCreatedAtDesc(post, pageable);

        return comments.map(comment -> CommentResponse.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt().toString())
                .updatedAt(comment.getUpdatedAt().toString())
                .build());
    }
}