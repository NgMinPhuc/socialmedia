package com.socialmedia.authen_service.mapper;


import com.socialmedia.authen_service.dto.request.RegisterRequest;
import com.socialmedia.authen_service.dto.response.LoginResponse;
import com.socialmedia.authen_service.dto.response.RegisterResponse;
import com.socialmedia.authen_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User registerRequestMapToUse(RegisterRequest registerRequest);

    RegisterResponse userToRegisterResponse(User user);

    @Mapping(source = "userEntity.username", target = "username")
    LoginResponse userEntityToLoginResponse(User userEntity, String accessToken);
}