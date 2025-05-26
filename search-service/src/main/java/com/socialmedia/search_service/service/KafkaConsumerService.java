package com.socialmedia.search_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.socialmedia.search_service.config.KafkaConfig;
import com.socialmedia.search_service.entity.PostDocument;
import com.socialmedia.search_service.entity.UserDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final SearchService searchService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaConfig.USER_EVENTS_TOPIC)
    public void consumeUserEvents(String message) {
        try {
            log.info("Received user event: {}", message);
            UserDocument userDocument = objectMapper.readValue(message, UserDocument.class);
            searchService.indexUser(userDocument);
        } catch (Exception e) {
            log.error("Error processing user event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = KafkaConfig.POST_EVENTS_TOPIC)
    public void consumePostEvents(String message) {
        try {
            log.info("Received post event: {}", message);
            PostDocument postDocument = objectMapper.readValue(message, PostDocument.class);
            searchService.indexPost(postDocument);
        } catch (Exception e) {
            log.error("Error processing post event: {}", e.getMessage(), e);
        }
    }
}