package com.socialmedia.user_service.dto.response;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationResponse {
    private String id;
    private String username;
    private String nickname;
    private LocalDate dob;
}
