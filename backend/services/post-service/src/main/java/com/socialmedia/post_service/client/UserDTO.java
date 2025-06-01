package com.socialmedia.post_service.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String userName;
    private LocalDate dob;
    private String phoneNumber;
    private String location;
    private String email;
    private String avatarUrl;
}
