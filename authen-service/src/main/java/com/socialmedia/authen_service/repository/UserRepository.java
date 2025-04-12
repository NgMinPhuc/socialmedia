package com.socialmedia.authen_service.repository;

import com.socialmedia.authen_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByEmailAndUsername(String email, String username);
    Optional<User> findByUsername(String username);
}