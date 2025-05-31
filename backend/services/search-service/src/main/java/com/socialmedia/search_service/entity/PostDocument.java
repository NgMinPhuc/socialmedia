package com.socialmedia.search_service.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.elasticsearch.annotations.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(indexName = "posts")
@Setting(settingPath = "elasticsearch/settings.json")
@Mapping(mappingPath = "elasticsearch/post-mapping.json")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDocument extends SearchDocument {
    @Field(type = FieldType.Keyword)
    String postId;

    @Field(type = FieldType.Keyword)
    String userId;

    @Field(type = FieldType.Text, analyzer = "custom_analyzer")
    String caption;

    @Field(type = FieldType.Text, analyzer = "custom_analyzer")
    String userFullName;

    @Field(type = FieldType.Keyword)
    String username;

    @Field(type = FieldType.Keyword)
    @Builder.Default
    List<String> contentTypes = new ArrayList<>();

    @Field(type = FieldType.Keyword)
    String privacy;

    @Field(type = FieldType.Date)
    LocalDateTime createdAt;

    @Field(type = FieldType.Date)
    LocalDateTime updatedAt;

    @Field(type = FieldType.Keyword)
    List<String> listCommentId;

    @Field(type = FieldType.Keyword)
    List<String> files;
}