package com.socialmedia.authen_service.mapper;

import com.socialmedia.authen_service.dto.request.RegisterRequest;
import com.socialmedia.authen_service.dto.request.UserProfileCreationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    @Mapping(target = "userId", ignore = true) // Will be set manually in service
    @Mapping(target = "userName", ignore = true) // Will be set manually in service
    UserProfileCreationRequest toUserProfileCreationRequest(RegisterRequest request);
}