package com.socialmedia.authen_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    private final String[] PUBLIC_ENDPOINTS = {
            "/auth/login",
            "/auth/register",
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request -> {
            request
                    .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS)
                    .permitAll();
            request
                    .anyRequest()
                    .authenticated();
        });


        http.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer ->
                        jwtConfigurer
                                .decoder(jwtDecoder())
        ));

        http.csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    JwtDecoder jwtDecoder(){
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");

        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

}