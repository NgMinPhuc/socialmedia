package com.socialmedia.search_service.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Getter
@Setter
public abstract class SearchDocument {
    @Id
    protected String id;

    @Field(type = FieldType.Date)
    protected LocalDateTime createdAt;

    @Field(type = FieldType.Date)
    protected LocalDateTime updatedAt;
}
