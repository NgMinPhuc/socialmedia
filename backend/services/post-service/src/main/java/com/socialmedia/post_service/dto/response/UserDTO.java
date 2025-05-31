package com.socialmedia.post_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
    String username;
    String email;
    String name;
    String bio;
    String avatar;
    String location;
    String website;
    Boolean isPrivate;
    Integer followersCount;
    Integer followingCount;
}
