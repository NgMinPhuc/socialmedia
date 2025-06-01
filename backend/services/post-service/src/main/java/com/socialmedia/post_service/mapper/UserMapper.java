package com.socialmedia.post_service.mapper;

import com.socialmedia.post_service.client.UserDTO;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMapper {
    
    /**
     * Convert from client UserDTO to response UserDTO for frontend use
     */
    public static com.socialmedia.post_service.dto.response.UserDTO toResponseDTO(UserDTO clientDTO) {
        if (clientDTO == null) {
            return null;
        }
        
        return com.socialmedia.post_service.dto.response.UserDTO.builder()
                .username(clientDTO.getUserName())
                .name(clientDTO.getFirstName() + " " + clientDTO.getLastName())
                .email(clientDTO.getEmail())
                .avatar(clientDTO.getAvatarUrl())
                .location(clientDTO.getLocation())
                .build();
    }
    
    /**
     * Create a default response UserDTO for when user info can't be retrieved
     */
    public static com.socialmedia.post_service.dto.response.UserDTO createDefaultUserDTO() {
        return com.socialmedia.post_service.dto.response.UserDTO.builder()
                .username("Unknown User")
                .name("Unknown User")
                .email("unknown@example.com")
                .avatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face")
                .bio("User information unavailable")
                .build();
    }
}
