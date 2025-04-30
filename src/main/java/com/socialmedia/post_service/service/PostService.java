package com.socialmedia.post_service.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.socialmedia.post_service.dto.request.post.CreatePostRequest;
import com.socialmedia.post_service.dto.request.post.UpdatePostRequest;
import com.socialmedia.post_service.dto.request.post.DeletePostRequest;
import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.entity.Post.MediaType;
import com.socialmedia.post_service.exception.PostNotFoundException;
import com.socialmedia.post_service.repository.PostRepository;

@Service
public class PostService {

    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private PostRepository postRepository;

    
    // Tạo bài viết mới
    public Post createPost(CreatePostRequest request) throws IOException {
        Post post = new Post();
        post.setUserId(request.getUserId());
        post.setCaption(request.getCaption());

        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            String filename = saveFile(file);
            post.setMediaUrl(filename);
            post.setMediaType(detectMediaType(file)); // Luôn trả về IMAGE
        }

        post.setLikeCount(0);
        post.setDislikeCount(0);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    // Lấy bài viết theo ID
    public Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
    }

    // Cập nhật bài viết
    public Post updatePost(Long postId, UpdatePostRequest request) throws IOException {
        Post post = getPost(postId);
        post.setCaption(request.getCaption());

        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            String filename = saveFile(file);
            post.setMediaUrl(filename);
            post.setMediaType(detectMediaType(file)); // Luôn trả về IMAGE
        }

        return postRepository.save(post);
    }

    // Xoá bài viết
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
        
        postRepository.delete(post);
    }
    

    // Thích bài viết
    public void likePost(Long postId) {
        Post post = getPost(postId);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    // Không thích bài viết
    public void dislikePost(Long postId) {
        Post post = getPost(postId);
        post.setDislikeCount(post.getDislikeCount() + 1);
        postRepository.save(post);
    }

    // Helper: Lưu file vào thư mục và trả về tên file
    private String saveFile(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String newFilename = UUID.randomUUID() + extension;

        File savedFile = new File(UPLOAD_DIR + newFilename);
        try (FileOutputStream fos = new FileOutputStream(savedFile)) {
            fos.write(file.getBytes());
        }

        return newFilename;
    }

    // Helper: Xác định loại file là IMAGE (nếu có file)
    private MediaType detectMediaType(MultipartFile file) {
        // Nếu có file thì luôn luôn là IMAGE
        return MediaType.IMAGE;
    }
}
