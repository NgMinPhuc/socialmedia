package com.socialmedia.user_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileCreationRequest {
    String authenId;
    String username;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String phoneNumber;
    String location;
}
