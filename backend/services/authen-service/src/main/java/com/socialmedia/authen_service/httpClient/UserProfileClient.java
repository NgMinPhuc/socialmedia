package com.socialmedia.authen_service.httpClient;

import com.socialmedia.authen_service.dto.request.UserProfileCreationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "userProfileClient", url = "${app.service.profile}")
public interface UserProfileClient {
    @PostMapping(value = "/users/create", produces = MediaType.APPLICATION_JSON_VALUE)
    Object createUserProfile(
            @RequestBody UserProfileCreationRequest request
    );
}
