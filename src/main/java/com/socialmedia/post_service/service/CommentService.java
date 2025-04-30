package com.socialmedia.post_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    // Tạo bình luận mới
    public Comment createComment(CreateCommentRequest request) {
        // Lấy bài viết từ ID
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + request.getPostId()));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUserId(request.getUserId());
        comment.setContent(request.getContent());

        // Khởi tạo các giá trị mặc định
        comment.setLikeCount(0);
        comment.setDislikeCount(0);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    // Lấy bình luận theo ID
    public Comment getComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + commentId));
    }

    // Cập nhật bình luận
    public Comment updateComment(Long commentId, UpdateCommentRequest request) {
        // Lấy bình luận từ DB
        Comment comment = getComment(commentId);

        // Cập nhật nội dung bình luận
        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    // Xoá bình luận
    public void deleteComment(DeleteCommentRequest request) {
        Comment comment = getComment(request.getCommentId());
        commentRepository.delete(comment);
    }

    // Thích bình luận
    public void likeComment(Long commentId) {
        Comment comment = getComment(commentId);
        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);
    }

    // Không thích bình luận
    public void dislikeComment(Long commentId) {
        Comment comment = getComment(commentId);
        comment.setDislikeCount(comment.getDislikeCount() + 1);
        commentRepository.save(comment);
    }

    // Lấy tất cả bình luận của một bài viết
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPost_Id(postId);
    }
}
