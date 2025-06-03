package com.socialmedia.user_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node("UserProfile")
public class UserProfile {

    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String userId;

    @Property("authenId")
    String authenId;

    @Property("firstName")
    String firstName;

    @Property("lastName")
    String lastName;

    @Property("userName")
    String username;

    @Property("dateOfBirth")
    LocalDate dob;

    @Property("phoneNumber")
    String phoneNumber;

    @Property("location")
    String location;

    @Property("email")
    String email;
}