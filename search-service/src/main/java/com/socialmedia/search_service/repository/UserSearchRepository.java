package com.socialmedia.search_service.repository;

import com.socialmedia.search_service.entity.UserDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, String> {
    Page<UserDocument> findByFirstNameContainingOrLastNameContainingOrUserNameContaining(String firstName, String lastName, String username, Pageable pageable);
    
    Page<UserDocument> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName, Pageable pageable);
}
