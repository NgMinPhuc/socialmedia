package com.socialmedia.search_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.time.LocalDate;

@Document(indexName = "users")
@Setting(settingPath = "elasticsearch/settings.json")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDocument extends SearchDocument {
    @Field(type = FieldType.Keyword)
    String userId;

    @Field(type = FieldType.Text, analyzer = "custom_analyzer")
    String firstName;

    @Field(type = FieldType.Text, analyzer = "custom_analyzer")
    String lastName;

    @Field(type = FieldType.Keyword)
    String userName;

    @Field(type = FieldType.Date)
    LocalDate dob;

    @Field(type = FieldType.Keyword)
    String phoneNumber;

    @Field(type = FieldType.Text)
    String location;

    @Field(type = FieldType.Keyword)
    String email;

    @Field(type = FieldType.Binary)
    byte[] avatar;
}