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
public class UserProfileUpdationRequest {
    
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName;
    
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    String lastName;
    
    @Past(message = "Date of birth must be in the past")
    LocalDate dob;
    
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Phone number must be between 9 and 15 digits")
    String phoneNumber;
    
    @Size(max = 100, message = "Location must be less than 100 characters")
    String location;
}