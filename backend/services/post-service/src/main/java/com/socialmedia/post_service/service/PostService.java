package com.socialmedia.post_service.service;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.DeletePostRequest;
import com.socialmedia.post_service.dto.request.post.GetPostRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.UserDTO;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.exception.AppException;
import com.socialmedia.post_service.exception.ErrorCode;
import com.socialmedia.post_service.exception.ResourceNotFoundException;
import com.socialmedia.post_service.mapper.UserMapper;
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
    FileService fileService;

    public PostResponse createPost(CreatePostRequest request) {
        // Process file uploads using FileService
        List<String> fileUrls = fileService.storeFiles(request.getFiles());

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
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, "Post not found with id: " + postId));

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
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, "Post not found with id: " + request.getPostId()));

        // Process files using FileService
        List<String> fileUrls;
        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            // Delete existing files
            fileService.deleteFiles(existingPost.getFiles());
            // Store new files
            fileUrls = fileService.storeFiles(request.getFiles());
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
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, "Post not found with id: " + postId));
        
        // Delete associated files
        fileService.deleteFiles(post.getFiles());

        postRepository.delete(post);
    }

    /**
     * Fetch user information from user service
     */
    private UserDTO fetchUserInfo(String userId) {
        return fetchUserInfoExternal(userId);
    }
    
    /**
     * Fetch user information from user service - accessible to other services
     */
    public UserDTO fetchUserInfoExternal(String userId) {
        try {
            ApiResponse<com.socialmedia.post_service.client.UserDTO> response = userClient.getUserById(userId);
            if (response != null && response.getResult() != null) {
                return com.socialmedia.post_service.mapper.UserMapper.toResponseDTO(response.getResult());
            } else {
                log.warn("User not found with id: {}", userId);
                // Return a default user DTO if user not found
                return com.socialmedia.post_service.mapper.UserMapper.createDefaultUserDTO();
            }
        } catch (Exception e) {
            log.error("Error fetching user info for userId: {}", userId, e);
            // Return a default user DTO if there's an error
            return com.socialmedia.post_service.mapper.UserMapper.createDefaultUserDTO();
        }
    }
}