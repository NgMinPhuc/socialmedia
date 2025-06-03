package com.socialmedia.authen_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileCreationRequest {
    String authenId;
    String firstName;
    String lastName;
    String username;
    LocalDate dob;
    String email;
    String phoneNumber;
    String location;
}
