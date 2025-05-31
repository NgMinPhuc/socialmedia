package com.socialmedia.post_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private CustomJwtDecoder customJwtDecoder;
    
    private static final String[] PUBLIC_ENDPOINTS = {
            "/feed/health",
            "/actuator/**"
    };
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request -> request
                .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
                .anyRequest().authenticated()
        );
        
        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> 
            jwtConfigurer.decoder(customJwtDecoder)
        ));
        http.csrf(AbstractHttpConfigurer::disable);
        
        return http.build();
    }
}
