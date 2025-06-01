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
    Optional<UserProfile> findByUserId(String userId);
    
    @Query("MATCH (a:`user profile`), (b:`user profile`) " +
           "WHERE id(a) = $followerId AND id(b) = $followeeId " +
           "CREATE (a)-[:FOLLOWS]->(b)")
    void createFollowRelationship(@Param("followerId") String followerId, 
                                 @Param("followeeId") String followeeId);
    
    @Query("MATCH (a:`user profile`)-[r:FOLLOWS]->(b:`user profile`) " +
           "WHERE id(a) = $followerId AND id(b) = $followeeId " +
           "DELETE r")
    void deleteFollowRelationship(@Param("followerId") String followerId, 
                                 @Param("followeeId") String followeeId);
                                 
    @Query("MATCH (a:`user profile`)-[:FOLLOWS]->(b:`user profile`) " +
           "WHERE a.userId = $userId " +
           "RETURN b")
    List<UserProfile> findFollowing(@Param("userId") String userId);
    
    @Query("MATCH (a:`user profile`)<-[:FOLLOWS]-(b:`user profile`) " +
           "WHERE a.userId = $userId " +
           "RETURN b")
    List<UserProfile> findFollowers(@Param("userId") String userId);
}