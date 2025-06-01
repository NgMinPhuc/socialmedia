package com.socialmedia.authen_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    String userId;

    @Column(name="username", nullable = false)
    String username;

    @Column(name="password")
    String password;

    @Column(name="email")
    String email;
    
    @Column(name="active")
    Boolean active = true;
    
    @Column(name="created_at")
    LocalDateTime createdAt;
    
    @Column(name="updated_at")
    LocalDateTime updatedAt;
    
    @Column(name="last_login")
    LocalDateTime lastLogin;
    
    @Column(name="failed_attempts")
    Integer failedAttempts = 0;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}