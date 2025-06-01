package com.socialmedia.authen_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNDEFINED_ERROR(9999, "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_CREDENTIALS_PASSWORD(404, "The provided password is incorrect", HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND(404, "User or email address does not exist", HttpStatus.NOT_FOUND),
    DUPLICATE_USERNAME_OR_EMAIL(409, "The username or email address is already registered", HttpStatus.CONFLICT),
    AUTHENTICATION_REQUIRED(401, "Authentication is required to access this resource", HttpStatus.UNAUTHORIZED),
    USERNAME_CONSTRAINT_VIOLATION(400, "Username must be between 3 to 20 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_CONSTRAINT_VIOLATION(400, "Password must be between 6 to 20 characters", HttpStatus.BAD_REQUEST),
    USERNAME_REQUIRED(400, "Username is required", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(400, "Email is required", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(400, "Password is required", HttpStatus.BAD_REQUEST),
    PASSWORDS_DO_NOT_MATCH(400, "Passwords do not match", HttpStatus.BAD_REQUEST),
    EXPIRED_TOKEN(401, "The token has expired", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(401, "The token is invalid", HttpStatus.UNAUTHORIZED),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}