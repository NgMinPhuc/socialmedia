package com.socialmedia.authen_service.mapper;


import com.socialmedia.authen_service.dto.request.RegisterRequest;
import com.socialmedia.authen_service.dto.response.LoginResponse;
import com.socialmedia.authen_service.dto.response.MessageResponse;
import com.socialmedia.authen_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User registerRequestMapToUse(RegisterRequest registerRequest);

    MessageResponse userToRegisterResponse(User user);

    @Mapping(source = "user.username", target = "username")
    LoginResponse userEntityToLoginResponse(User user, String accessToken);
}