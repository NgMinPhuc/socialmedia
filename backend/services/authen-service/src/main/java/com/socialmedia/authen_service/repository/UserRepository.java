package com.socialmedia.authen_service.repository;

import com.socialmedia.authen_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    @Query("SELECT u FROM User u WHERE (:usernameOrEmail = u.username OR :usernameOrEmail = u.email)")
    Optional<User> findByUsernameOrEmailInput(@Param("usernameOrEmail") String usernameOrEmail);
    
    boolean existsByEmailAndUsername(String email, String username);
    Optional<User> findByUsername(String username);
    Optional<User> findByAuthenId(UUID authenId);
}