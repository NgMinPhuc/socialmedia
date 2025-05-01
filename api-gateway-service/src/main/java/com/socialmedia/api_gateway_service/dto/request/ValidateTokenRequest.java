package com.socialmedia.api_gateway_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ValidateTokenRequest {

    @NotBlank(message = "Token cannot be blank")
    String token;
}
