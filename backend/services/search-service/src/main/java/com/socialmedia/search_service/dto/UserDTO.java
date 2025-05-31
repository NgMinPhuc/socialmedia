package com.socialmedia.search_service.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
    String id;
    String userId;
    String firstName;
    String lastName;
    String userName;
    LocalDate dob;
    String phoneNumber;
    String location;
    String email;
    byte[] avatar;
}