package com.socialmedia.search_service.client;

import com.socialmedia.search_service.dto.UserDTO;
import com.socialmedia.search_service.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service", url = "${app.user-service.url}")
public interface UserClient {
    @GetMapping("/users/{userId}")
    ApiResponse<UserDTO> getUser(@PathVariable String userId);
    
    @GetMapping("/users/all")
    ApiResponse<List<UserDTO>> getAllUsers();
}
