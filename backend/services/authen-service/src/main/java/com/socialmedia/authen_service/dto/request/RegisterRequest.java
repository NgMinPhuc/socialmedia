package com.socialmedia.authen_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {

    @Size(min = 3, max = 20, message = "USERNAME_CONSTRAINT_VIOLATION")
    @NotBlank(message = "USERNAME_REQUIRED")
    String username;

    @NotBlank(message = "EMAIL_REQUIRED")
    String email;

    @Size(min = 6, max = 20, message = "PASSWORD_CONSTRAINT_VIOLATION")
    @NotBlank(message = "PASSWORD_REQUIRED")
    String password;

    String firstName;
    String lastName;
    LocalDate dob;
    String phoneNumber;
    String location;
}