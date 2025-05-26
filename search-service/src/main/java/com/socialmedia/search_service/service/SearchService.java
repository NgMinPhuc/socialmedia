package com.socialmedia.search_service.service;

import com.socialmedia.search_service.client.PostClient;
import com.socialmedia.search_service.client.UserClient;
import com.socialmedia.search_service.dto.PostDTO;
import com.socialmedia.search_service.dto.UserDTO;
import com.socialmedia.search_service.entity.PostDocument;
import com.socialmedia.search_service.entity.UserDocument;
import com.socialmedia.search_service.repository.PostSearchRepository;
import com.socialmedia.search_service.repository.UserSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {
    private final PostSearchRepository postSearchRepository;
    private final UserSearchRepository userSearchRepository;
    private final PostClient postClient;
    private final UserClient userClient;

    // Core search methods
    @Cacheable(key = "#query")
    public Page<PostDocument> searchPosts(String query, Pageable pageable) {
        return postSearchRepository.findByCaptionContainingOrUserFullNameContainingOrUsernameContaining(
                query, query, query, pageable);
    }

    @Cacheable(key = "#content")
    public Page<PostDocument> searchPostsByContent(String content, Pageable pageable) {
        return postSearchRepository.findByCaptionContainingOrderByCreatedAtDesc(content, pageable);
    }

    @Cacheable(key = "#query")
    public Page<UserDocument> searchUsers(String query, Pageable pageable) {
        return userSearchRepository.findByFirstNameContainingOrLastNameContainingOrUserNameContaining(query, query, query, pageable);
    }

    @Cacheable(key = "#query")
    public Page<UserDocument> searchUsersByBio(String query, Pageable pageable) {
        return userSearchRepository.findByFirstNameContainingOrLastNameContaining(query, query, pageable);
    }

    // Indexing methods
    public void indexPost(PostDocument post) {
        try {
            postSearchRepository.save(post);
        } catch (Exception e) {
            log.error("Error indexing post {}: {}", post.getPostId(), e.getMessage());
        }
    }

    public void indexUser(UserDocument user) {
        try {
            userSearchRepository.save(user);
        } catch (Exception e) {
            log.error("Error indexing user {}: {}", user.getUserId(), e.getMessage());
        }
    }

    // Bulk operations
    public void indexBulkPosts(List<PostDocument> posts) {
        try {
            postSearchRepository.saveAll(posts);
        } catch (Exception e) {
            log.error("Error bulk indexing posts: {}", e.getMessage());
        }
    }

    public void indexBulkUsers(List<UserDocument> users) {
        try {
            userSearchRepository.saveAll(users);
        } catch (Exception e) {
            log.error("Error bulk indexing users: {}", e.getMessage());
        }
    }

    // Reindex functionality 
    public void reindexAllData() {
        try {
            // Reindex posts
            var postsResponse = postClient.getPostsByUser("all");
            if (postsResponse.getCode() == 200 && postsResponse.getResult() != null) {
                List<PostDocument> posts = postsResponse.getResult().stream()
                    .map(this::convertToPostDocument)
                    .collect(Collectors.toList());
                indexBulkPosts(posts);
            }

            // Reindex users  
            var usersResponse = userClient.getAllUsers();
            if (usersResponse.getCode() == 200 && usersResponse.getResult() != null) {
                List<UserDocument> users = usersResponse.getResult().stream()
                    .map(this::convertToUserDocument)
                    .collect(Collectors.toList());
                indexBulkUsers(users);
            }
        } catch (Exception e) {
            log.error("Error during reindexing: {}", e.getMessage());
        }
    }

    private PostDocument convertToPostDocument(PostDTO dto) {
        return PostDocument.builder()
            .postId(dto.getPostId())
            .userId(dto.getUserId())
            .caption(dto.getCaption())
            .files(dto.getFiles())
            .contentTypes(dto.getContentTypes())
            .privacy(dto.getPrivacy())
            .listCommentId(dto.getListCommentId())
            .createdAt(dto.getCreatedAt())
            .updatedAt(dto.getUpdatedAt())
            .build();
    }

    private UserDocument convertToUserDocument(UserDTO dto) {
        return UserDocument.builder()
            .userId(dto.getId())
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .userName(dto.getUserName())
            .dob(dto.getDob())
            .phoneNumber(dto.getPhoneNumber())
            .location(dto.getLocation())
            .email(dto.getEmail())
            .avatar(dto.getAvatar())
            .build();
    }
}
