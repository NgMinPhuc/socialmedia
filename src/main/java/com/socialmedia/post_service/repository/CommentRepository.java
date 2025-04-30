package com.socialmedia.post_service.repository;

import com.socialmedia.post_service.entity.Comment;
import com.socialmedia.post_service.entity.Post;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_Id(Long postId);
}

