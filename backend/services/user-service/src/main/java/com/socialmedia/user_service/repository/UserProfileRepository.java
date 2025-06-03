package com.socialmedia.user_service.repository;

import com.socialmedia.user_service.entity.UserProfile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    Optional<UserProfile> findByAuthenId(String authenId);

    // Method to check if a user profile exists for a given userId
    boolean existsByAuthenId(String authenId);

    // Method to check if a user profile exists with a given username
    boolean existsByUsername(String userName);

    // Method to check if a user profile exists with a given email
    boolean existsByEmail(String email);

}