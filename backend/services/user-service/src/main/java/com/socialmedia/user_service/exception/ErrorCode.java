package com.socialmedia.user_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST), // Adjusted message
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST), // General user existence
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND), // General user existence
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    AVATAR_SIZE_EXCEEDED(1009, "Avatar file size exceeds maximum allowed", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(1010, "Invalid file type. Only image files are allowed", HttpStatus.BAD_REQUEST),
    AVATAR_NOT_FOUND(1011, "User avatar not found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(1012, "Invalid request data", HttpStatus.BAD_REQUEST),

    // New/Updated Error Codes for UserProfileService
    USER_PROFILE_EXISTS(1013, "User profile already exists for this user ID", HttpStatus.BAD_REQUEST),
    DUPLICATE_USERNAME(1014, "Username is already taken by another profile", HttpStatus.CONFLICT), // HttpStatus.CONFLICT is more appropriate for duplication
    DUPLICATE_EMAIL(1015, "Email is already taken by another profile", HttpStatus.CONFLICT), // HttpStatus.CONFLICT is more appropriate for duplication
    USER_PROFILE_NOT_FOUND(1016, "User profile not found", HttpStatus.NOT_FOUND),
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