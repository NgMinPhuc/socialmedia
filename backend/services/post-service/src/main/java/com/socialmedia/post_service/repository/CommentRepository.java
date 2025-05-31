package com.socialmedia.post_service.repository;

import com.socialmedia.post_service.entity.Comment;
import com.socialmedia.post_service.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);
}
