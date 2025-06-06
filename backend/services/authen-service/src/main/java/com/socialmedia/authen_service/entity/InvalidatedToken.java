package com.socialmedia.authen_service.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "blacklist")
public class InvalidatedToken {
    @Id
    @Column(name = "id")
    String id;

    @Column(name = "expired_at")
    Date expiredAt;
}