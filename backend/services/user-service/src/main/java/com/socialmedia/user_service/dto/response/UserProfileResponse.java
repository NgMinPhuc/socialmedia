package com.socialmedia.user_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String userId;
    String authenId;
    String firstName;
    String lastName;
    String username;
    LocalDate dob;
    String phoneNumber;
    String location;
    String email;
}
