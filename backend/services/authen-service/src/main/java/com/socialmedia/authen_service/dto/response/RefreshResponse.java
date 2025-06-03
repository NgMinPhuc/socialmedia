package com.socialmedia.authen_service.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NotBlank
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RefreshResponse {
    String newAccessToken;
    String newRefreshToken;
    String message;
}
