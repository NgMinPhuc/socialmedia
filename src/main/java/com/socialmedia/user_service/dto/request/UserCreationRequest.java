package com.socialmedia.user_service.dto.request;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
public class UserCreationRequest {

    private String firstname;
    private String lastname;
    private String location;
    private String phoneNumber;
    private String nickname;
    private LocalDate dob;
   
}
