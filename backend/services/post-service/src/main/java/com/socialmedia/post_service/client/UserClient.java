package com.socialmedia.post_service.client;

import com.socialmedia.post_service.dto.response.ApiResponse;
import com.socialmedia.post_service.dto.response.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "${app.user-service.url}")
public interface UserClient {
    
    @GetMapping("/api/v1/users/{userId}")
    ApiResponse<UserDTO> getUserById(@PathVariable("userId") String userId);

    @GetMapping("/api/v1/users/exists/{userId}")
    ApiResponse<Boolean> checkUserExists(@PathVariable("userId") String userId);
}
