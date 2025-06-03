package com.socialmedia.post_service.repository;

import com.socialmedia.post_service.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAuthenIdOrderByCreatedAtDesc(String authenId);

    Page<Post> findAllByAuthenId(String authenId, Pageable pageable);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<Post> findByIdAndAuthenId(String id, String authenId);

    Page<Post> findByAuthenIdInOrderByCreatedAtDesc(List<String> authenIds, Pageable pageable);

    Page<Post> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from, LocalDateTime to, Pageable pageable);


    @Query("{'caption': {$regex: ?0, $options: 'i'}}")
    Page<Post> findByCaptionContainingOrderByCreatedAtDesc(String searchQuery, Pageable pageable);
}