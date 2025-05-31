package com.socialmedia.authen_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NotBlank
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RefreshRequest {
    String refreshToken;
}
