package com.socialmedia.api_gateway_service.config;

import com.socialmedia.api_gateway_service.repository.ValidationClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfiguration {

    @Bean
    WebClient webClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }

    @Bean
    ValidationClient validationClient(WebClient webClient) {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(webClient)).build();

        return httpServiceProxyFactory.createClient(ValidationClient.class);
    }
}
