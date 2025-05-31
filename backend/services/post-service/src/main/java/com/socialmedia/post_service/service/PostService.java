package com.socialmedia.post_service.service;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.DeletePostRequest;
import com.socialmedia.post_service.dto.request.post.GetPostRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.UserDTO;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.exception.ResourceNotFoundException;
import com.socialmedia.post_service.repository.PostRepository;
import com.socialmedia.post_service.client.UserClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class PostService {
    PostRepository postRepository;
    UserClient userClient;

    public PostResponse createPost(CreatePostRequest request) {
        // Process file uploads - for now, store as placeholder URLs
        List<String> fileUrls = new ArrayList<>();
        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            for (int i = 0; i < request.getFiles().size(); i++) {
                // TODO: Implement actual file upload to cloud storage
                fileUrls.add("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop");
            }
        }

        Post post = Post.builder()
                .userId(request.getUserId())
                .caption(request.getCaption())
                .privacy(request.getPrivacy())
                .files(fileUrls)
                .contentTypes(request.getContentTypes())
                .likesCount(0)
                .commentsCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        post = postRepository.save(post);

        // Fetch user information
        UserDTO author = fetchUserInfo(post.getUserId());

        return PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .privacy(post.getPrivacy())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .author(author)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public PostResponse getPost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // Fetch user information
        UserDTO author = fetchUserInfo(post.getUserId());

        return PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .privacy(post.getPrivacy())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .author(author)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public Page<PostResponse> getPosts(String userId, Pageable pageable) {
        Page<Post> posts;
        if (userId != null && !userId.isEmpty()) {
            posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return posts.map(post -> {
            // Fetch user information for each post
            UserDTO author = fetchUserInfo(post.getUserId());
            
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
        });
    }


    public PostResponse updatePost(UpdatePostRequest request) {
        Post existingPost = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + request.getPostId()));

        // Process files to URLs (simplified - in real app would upload to cloud storage)
        List<String> fileUrls = new ArrayList<>();
        if (request.getFiles() != null) {
            for (MultipartFile file : request.getFiles()) {
                // In a real application, you would upload to cloud storage and get URLs
                // For now, just use placeholder URLs
                fileUrls.add("https://example.com/files/" + file.getOriginalFilename());
            }
        } else {
            // Keep existing files if no new files provided
            fileUrls = existingPost.getFiles();
        }

        Post post = Post.builder()
                .postId(request.getPostId())
                .userId(existingPost.getUserId())
                .caption(request.getCaption())
                .files(fileUrls)
                .contentTypes(request.getContentTypes() != null ? request.getContentTypes() : existingPost.getContentTypes())
                .privacy(request.getPrivacy())
                .likesCount(existingPost.getLikesCount())
                .commentsCount(existingPost.getCommentsCount())
                .createdAt(existingPost.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        post = postRepository.save(post);

        // Fetch user information
        UserDTO author = fetchUserInfo(post.getUserId());

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

    /**
     * Delete a post
     */
    public void deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        postRepository.delete(post);
    }

    /**
     * Fetch user information from user service
     */
    private UserDTO fetchUserInfo(String userId) {
        try {
            ApiResponse<UserDTO> response = userClient.getUserById(userId);
            if (response != null && response.getResult() != null) {
                return response.getResult();
            } else {
                log.warn("User not found with id: {}", userId);
                // Return a default user DTO if user not found
                return UserDTO.builder()
                        .username("Unknown User")
                        .name("Unknown User")
                        .email("unknown@example.com")
                        .avatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face")
                        .bio("User information unavailable")
                        .build();
            }
        } catch (Exception e) {
            log.error("Error fetching user info for userId: {}", userId, e);
            // Return a default user DTO if there's an error
            return UserDTO.builder()
                    .username("Unknown User")
                    .name("Unknown User")
                    .email("unknown@example.com")
                    .avatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face")
                    .bio("Error loading user information")
                    .build();
        }
    }
}