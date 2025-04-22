package com.socialmedia.user_service.dto.request;
import java.time.LocalDate;

import lombok.*;
@Getter
@Setter
public class UserUpdateRequest {

    private String firstName;
    private String lastName;
    private String location;
    private String phoneNumber;
    private String nickname;
    private LocalDate dob;
 
}
