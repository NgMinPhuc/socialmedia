package com.socialmedia.user_service.dto.request;
import java.time.LocalDate;

import lombok.*;
@Getter
@Setter
public class UserUpdateRequest {
    private String username;
    private String nickname;
    private LocalDate dob;

 
}
