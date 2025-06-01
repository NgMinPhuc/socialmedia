package com.socialmedia.post_service.service;

import com.socialmedia.post_service.dto.request.post.PostFilterRequest;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.dto.response.UserDTO;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostSearchService {
    PostRepository postRepository;
    PostService postService;

    public Page<PostResponse> findPostsWithFilters(PostFilterRequest filterRequest, Pageable pageable) {
        if (isEmptyFilter(filterRequest)) {
            return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                    .map(this::mapToPostResponse);
        }

        if (filterRequest.getUserIds() != null && !filterRequest.getUserIds().isEmpty()) {
            return postRepository.findByUserIdInOrderByCreatedAtDesc(filterRequest.getUserIds(), pageable)
                    .map(this::mapToPostResponse);
        }

        if (filterRequest.getContentType() != null) {
            return postRepository.findByContentTypesContainingOrderByCreatedAtDesc(filterRequest.getContentType(), pageable)
                    .map(this::mapToPostResponse);
        }

        if (filterRequest.getFromDate() != null && filterRequest.getToDate() != null) {
            return postRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(
                    filterRequest.getFromDate(), filterRequest.getToDate(), pageable)
                    .map(this::mapToPostResponse);
        }

        if (filterRequest.getPrivacy() != null) {
            return postRepository.findByPrivacyOrderByCreatedAtDesc(filterRequest.getPrivacy(), pageable)
                    .map(this::mapToPostResponse);
        }

        if (filterRequest.getSearchQuery() != null && !filterRequest.getSearchQuery().isEmpty()) {
            return postRepository.findByCaptionContainingOrderByCreatedAtDesc(filterRequest.getSearchQuery(), pageable)
                    .map(this::mapToPostResponse);
        }

        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToPostResponse);
    }
    
    private boolean isEmptyFilter(PostFilterRequest filterRequest) {
        return filterRequest == null ||
                (filterRequest.getUserIds() == null || filterRequest.getUserIds().isEmpty()) &&
                filterRequest.getContentType() == null &&
                filterRequest.getFromDate() == null &&
                filterRequest.getToDate() == null &&
                filterRequest.getPrivacy() == null &&
                (filterRequest.getSearchQuery() == null || filterRequest.getSearchQuery().isEmpty());
    }
    
    private PostResponse mapToPostResponse(Post post) {
        // Fetch user information
        UserDTO author = postService.fetchUserInfoExternal(post.getUserId());
        
        return PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
                .privacy(post.getPrivacy())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .author(author)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
