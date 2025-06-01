package com.socialmedia.post_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // Post errors
    POST_NOT_FOUND(404, "Post not found", HttpStatus.NOT_FOUND),
    INVALID_POST_DATA(400, "Invalid post data", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_POST_ACCESS(403, "Unauthorized access to post", HttpStatus.FORBIDDEN),
    
    // Comment errors
    COMMENT_NOT_FOUND(404, "Comment not found", HttpStatus.NOT_FOUND),
    INVALID_COMMENT_DATA(400, "Invalid comment data", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_COMMENT_ACCESS(403, "Unauthorized access to comment", HttpStatus.FORBIDDEN),
    
    // File errors
    FILE_TOO_LARGE(413, "File is too large", HttpStatus.PAYLOAD_TOO_LARGE),
    UNSUPPORTED_MEDIA_TYPE(415, "Unsupported media type", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    FILE_UPLOAD_ERROR(500, "Error uploading file", HttpStatus.INTERNAL_SERVER_ERROR),
    
    // User errors
    USER_NOT_FOUND(404, "User not found", HttpStatus.NOT_FOUND),
    
    // Server errors
    INTERNAL_SERVER_ERROR(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final Integer code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(Integer code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
