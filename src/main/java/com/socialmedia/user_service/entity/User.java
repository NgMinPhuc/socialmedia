package com.socialmedia.user_service.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;
@Getter
@Setter

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String firstName;
    private String lastName;
    private String nickname;
    private LocalDate dob;
    private String phoneNumber;
    private byte[] avatar; // Kiểu dữ liệu mảng byte cho avatar
    private String location; // User's location

}
