package com.socialmedia.search_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    public static final String USER_EVENTS_TOPIC = "user-events";
    public static final String POST_EVENTS_TOPIC = "post-events";

    @Bean
    public NewTopic userTopic() {
        return TopicBuilder.name(USER_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic postTopic() {
        return TopicBuilder.name(POST_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}