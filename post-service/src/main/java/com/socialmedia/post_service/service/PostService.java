package com.socialmedia.post_service.service;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.DeletePostRequest;
import com.socialmedia.post_service.dto.request.post.GetPostRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.response.post.PostResponse;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.exception.ResourceNotFoundException;
import com.socialmedia.post_service.repository.PostRepository;
import com.socialmedia.post_service.client.UserClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class PostService {
    PostRepository postRepository;
    UserClient userClient;

    public PostResponse createPost(CreatePostRequest request) {
        Post post = Post.builder()
                .userId(request.getUserId())
                .caption(request.getCaption())
                .privacy(request.getPrivacy())
                .files(request.getFiles())
                .contentTypes(request.getContentTypes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        post = postRepository.save(post);

        return PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .privacy(post.getPrivacy())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public PostResponse getPost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        return PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .privacy(post.getPrivacy())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
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

        return posts.map(post -> PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
                .privacy(post.getPrivacy())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build());
    }

    public PostResponse updatePost(UpdatePostRequest request) {
        Post existingPost = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + request.getPostId()));

        Post post = Post.builder()
                .postId(request.getPostId())
                .userId(existingPost.getUserId())
                .caption(request.getCaption())
                .files(request.getFiles())
                .contentTypes(request.getContentTypes())
                .privacy(request.getPrivacy())
                .createdAt(existingPost.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        post = postRepository.save(post);

        return PostResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUserId())
                .caption(post.getCaption())
                .files(post.getFiles())
                .contentTypes(post.getContentTypes())
                .privacy(post.getPrivacy())
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
}