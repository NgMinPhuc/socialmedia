package com.socialmedia.post_service.repository;

import com.socialmedia.post_service.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    Page<Post> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Advanced filtering methods
    Page<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds, Pageable pageable);
    
    Page<Post> findByContentTypesContainingOrderByCreatedAtDesc(String contentType, Pageable pageable);
    
    Page<Post> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from, LocalDateTime to, Pageable pageable);
    
    Page<Post> findByPrivacyOrderByCreatedAtDesc(String privacy, Pageable pageable);
    
    @Query("{'caption': {$regex: ?0, $options: 'i'}}")
    Page<Post> findByCaptionContainingOrderByCreatedAtDesc(String searchQuery, Pageable pageable);
    
    @Query("{'userId': {'$in': ?0}, 'contentTypes': {'$in': ?1}, 'createdAt': {'$gte': ?2, '$lte': ?3}, 'privacy': ?4}")
    Page<Post> findWithFilters(List<String> userIds, List<String> contentTypes, LocalDateTime from, LocalDateTime to, String privacy, Pageable pageable);
}