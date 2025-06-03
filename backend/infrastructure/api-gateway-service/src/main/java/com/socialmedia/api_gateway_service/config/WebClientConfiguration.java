package com.socialmedia.api_gateway_service.config;

import com.socialmedia.api_gateway_service.repository.ValidationClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.List;

@Configuration
public class WebClientConfiguration {
//    @Bean
//    WebClient webClient() {
//        return WebClient.builder()
//                .baseUrl("http://localhost:8081")
//                .build();
//    }
//
//
//    @Bean
//    ValidationClient validationClient(WebClient webClient) {
//        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
//                .builderFor(WebClientAdapter.create(webClient))
//                .build();
//
//        return httpServiceProxyFactory.createClient(ValidationClient.class);
//    }

    // 1. WebClient DÀNH CHO AUTH-SERVICE
    // Được đánh dấu @Qualifier để dễ dàng inject vào nơi cần dùng (ví dụ ValidationClient)
    @Bean
    @Qualifier("authServiceWebClient") // Tên của bean WebClient này
    WebClient authServiceWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8081") // Địa chỉ cứng của Auth Service
                .build();
    }

    // 2. WebClient DÀNH CHO USER-SERVICE
    // Nếu API Gateway cần gọi User Service, thì đây là WebClient bạn sẽ dùng.
    @Bean
    @Qualifier("userServiceWebClient") // Tên của bean WebClient này
    WebClient userServiceWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8082") // Địa chỉ cứng của User Service (theo Eureka Dashboard bạn đã gửi)
                .build();
    }

    // 3. ValidationClient SẼ DÙNG authServiceWebClient
    // Đảm bảo bạn inject đúng WebClient mà ValidationClient cần (Auth Service)
    @Bean
    ValidationClient validationClient(@Qualifier("authServiceWebClient") WebClient webClientForAuth) {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(webClientForAuth))
                .build();
        return httpServiceProxyFactory.createClient(ValidationClient.class);
    }
}
