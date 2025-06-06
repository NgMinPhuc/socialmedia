package com.socialmedia.authen_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AutheServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutheServiceApplication.class, args);
	}

}
