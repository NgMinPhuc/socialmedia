package com.socialmedia.user_service.dto.response;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String location;
    private String phoneNumber;
    private String nickname;
    private LocalDate dob;
}
