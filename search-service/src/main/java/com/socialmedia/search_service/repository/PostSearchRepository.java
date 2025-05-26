package com.socialmedia.search_service.repository;

import com.socialmedia.search_service.entity.PostDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostSearchRepository extends ElasticsearchRepository<PostDocument, String> {
    Page<PostDocument> findByCaptionContainingOrUserFullNameContainingOrUsernameContaining(
            String caption, String userFullName, String username, Pageable pageable);
    
    Page<PostDocument> findByCaptionContainingOrderByCreatedAtDesc(String caption, Pageable pageable);
}
