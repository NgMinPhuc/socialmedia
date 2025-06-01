package com.socialmedia.user_service.exception;

import java.util.List;
import java.util.Map;

import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {
    private final Map<String, List<String>> errors;
    
    public ValidationException(Map<String, List<String>> errors) {
        super("Validation failed");
        this.errors = errors;
    }
}
