package com.socialmedia.user_service.exception;

public class AvatarNotFoundException extends RuntimeException {
    public AvatarNotFoundException(String message) {
        super(message);
    }
}

