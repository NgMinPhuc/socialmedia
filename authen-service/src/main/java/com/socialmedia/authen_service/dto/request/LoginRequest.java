package com.socialmedia.authen_service.dto.request;

import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Email
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    String username;
    String email;
    String password;
}