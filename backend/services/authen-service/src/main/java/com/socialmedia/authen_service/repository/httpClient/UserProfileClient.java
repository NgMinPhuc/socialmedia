package com.socialmedia.authen_service.repository.httpClient;

import com.socialmedia.authen_service.dto.request.UserProfileCreationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "userProfileClient", url = "${app.service.profile}")
public interface UserProfileClient {
    @PostMapping(value = "/users/create", produces = MediaType.APPLICATION_JSON_VALUE)
    Object createUserProfile(
            @RequestBody UserProfileCreationRequest request
    );

    @PostMapping(value = "/users/update", produces = MediaType.APPLICATION_JSON_VALUE)
    Object updateUserProfile(@RequestBody UserProfileCreationRequest request);
}
