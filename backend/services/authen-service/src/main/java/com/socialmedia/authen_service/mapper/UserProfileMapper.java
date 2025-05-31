package com.socialmedia.authen_service.mapper;

import com.socialmedia.authen_service.dto.request.RegisterRequest;
import com.socialmedia.authen_service.dto.request.UserProfileCreationRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileCreationRequest toUserProfileCreationRequest(RegisterRequest request);
}