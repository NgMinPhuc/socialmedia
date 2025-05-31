package com.socialmedia.search_service.client;

import com.socialmedia.search_service.dto.PostDTO;
import com.socialmedia.search_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "post-service", url = "${app.post-service.url}")
public interface PostClient {
    @GetMapping("/posts/{postId}")
    ApiResponse<PostDTO> getPost(@PathVariable String postId);
    
    @GetMapping("/posts/user/{userId}")
    ApiResponse<List<PostDTO>> getPostsByUser(@PathVariable String userId);
}
