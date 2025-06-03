package com.socialmedia.post_service.service;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.GetPostByPostIdRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.post.PostDeleteResponse;
import com.socialmedia.post_service.dto.response.post.PostListResponse;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.exception.AppException;
import com.socialmedia.post_service.exception.ErrorCode;
import com.socialmedia.post_service.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostService {

    PostRepository postRepository;

    private PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .authenId(post.getAuthenId())
                .caption(post.getCaption())
                .mediaUrls(post.getMediaUrls())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .privacy(post.getPrivacy())
                .build();
    }

    private PostListResponse toPostListResponse(Page<Post> postPage) {
        List<PostResponse> postResponses = postPage.getContent().stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());

        return PostListResponse.builder()
                .posts(postResponses)
                .page(postPage.getNumber())
                .size(postPage.getSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .last(postPage.isLast())
                .build();
    }

    @Transactional
    public PostResponse createPost(String authenId, CreatePostRequest request) {
        log.info("Request to create post for authenId: {}", authenId);

        Post newPost = Post.builder()
                .authenId(authenId)
                .caption(request.getCaption())
                .mediaUrls(request.getMediaUrls())
                .privacy(request.getPrivacy())
                .createdAt(LocalDateTime.from(Instant.now()))
                .updatedAt(LocalDateTime.from(Instant.now()))
                .likesCount(0)
                .commentsCount(0)
                .build();

        Post savedPost = postRepository.save(newPost);
        log.info("Post created successfully with ID: {} for authenId: {}", savedPost.getId(), authenId);
        return toPostResponse(savedPost);
    }

    @Transactional
    public PostResponse updatePost(String authenId, UpdatePostRequest request) {
        String postId = request.getPostId();
        log.info("Request to update post with ID: {} by authenId: {}", postId, authenId);

        Post existingPost = postRepository.findByIdAndAuthenId(postId, authenId)
                .orElseThrow(() -> {
                    log.warn("Post with ID: {} not found or unauthorized for authenId: {}", postId, authenId);
                    return new AppException(ErrorCode.POST_NOT_FOUND_OR_UNAUTHORIZED);
                });

        existingPost.setCaption(request.getCaption());
        existingPost.setMediaUrls(request.getMediaUrls());
        existingPost.setPrivacy(request.getPrivacy());
        existingPost.setUpdatedAt(LocalDateTime.from(Instant.now()));

        Post updatedPost = postRepository.save(existingPost);
        log.info("Post updated successfully with ID: {} by authenId: {}", updatedPost.getId(), authenId);
        return toPostResponse(updatedPost);
    }

    @Transactional
    public PostDeleteResponse deletePost(GetPostByPostIdRequest request, String authenId) {
        String postId = request.getPostId();
        log.info("Request to delete post with ID: {} by authenId: {}", postId, authenId);

        Post post = postRepository.findByIdAndAuthenId(postId, authenId)
                .orElseThrow(() -> {
                    log.warn("Post with ID: {} not found or unauthorized for authenId: {}", postId, authenId);
                    return new AppException(ErrorCode.POST_NOT_FOUND_OR_UNAUTHORIZED);
                });

        postRepository.delete(post);
        log.info("Post deleted successfully with ID: {} by authenId: {}", postId, authenId);

        return PostDeleteResponse.builder()
                .isSuccess(true)
                .message("Post deleted successfully")
                .build();
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(GetPostByPostIdRequest request) {
        String postId = request.getPostId();
        log.info("Fetching post with ID: {}", postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> {
                    log.warn("Post with ID: {} not found", postId);
                    return new AppException(ErrorCode.POST_NOT_FOUND);
                });

        return toPostResponse(post);
    }

    @Transactional(readOnly = true)
    public PostListResponse getPostsByAuthenId(String authenId, Pageable pageable) {
        log.info("Fetching posts for authenId: {} with pagination", authenId);

        Page<Post> postPage = postRepository.findAllByAuthenId(authenId, pageable);
        return toPostListResponse(postPage);
    }

    @Transactional(readOnly = true)
    public PostListResponse getAllPosts(Pageable pageable) {
        log.info("Fetching all posts with pagination");

        Page<Post> postPage = postRepository.findAll(pageable);
        return toPostListResponse(postPage);
    }
}
