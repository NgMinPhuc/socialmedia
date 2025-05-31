package com.socialmedia.search_service.mapper;

import com.socialmedia.search_service.dto.PostDTO;
import com.socialmedia.search_service.dto.UserDTO;
import com.socialmedia.search_service.entity.PostDocument;
import com.socialmedia.search_service.entity.UserDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface SearchMapper {
    
    @Mapping(source = "postId", target = "postId")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "caption", target = "caption")
    @Mapping(source = "files", target = "files")
    @Mapping(source = "contentTypes", target = "contentTypes")
    @Mapping(source = "privacy", target = "privacy")
    @Mapping(source = "listCommentId", target = "listCommentId")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    PostDocument postDtoToDocument(PostDTO dto);

    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "firstName", target = "firstName")
    @Mapping(source = "lastName", target = "lastName")
    @Mapping(source = "userName", target = "userName")
    @Mapping(source = "dob", target = "dob")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "location", target = "location")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "avatar", target = "avatar")
    UserDocument userDtoToDocument(UserDTO dto);

}
