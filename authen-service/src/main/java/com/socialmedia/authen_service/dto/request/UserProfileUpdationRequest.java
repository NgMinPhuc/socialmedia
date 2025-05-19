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
public class UserProfileUpdationRequest {
    String profileId;
    String userId;
    String firstName;
    String lastName;
    String userName;
    LocalDate dob;
    String phoneNumber;
    String location;
    String email;
}