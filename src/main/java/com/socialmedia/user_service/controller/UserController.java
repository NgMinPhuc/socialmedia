package com.socialmedia.user_service.controller;

import org.springframework.web.bind.annotation.RestController;

import com.socialmedia.user_service.dto.request.UserCreationRequest;
import com.socialmedia.user_service.dto.request.UserUpdateRequest;
import com.socialmedia.user_service.entity.User;
import com.socialmedia.user_service.service.UserService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    //create user
    @PostMapping("/createUsers")
    User createUser(@RequestBody UserCreationRequest request) {
        return userService.createUser(request);
    }
    
    //get all user
    @GetMapping("/getUsers")
    List<User> getUsers() {
        return userService.getUsers();
    }
    

    //get user by id
    @GetMapping("/getUser/{userId}")
    User getUser(@PathVariable String userId) {
        return userService.getUser(userId);
    }

    //update user 
    @PutMapping("/updateUser/{userId}")
    User updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request ){
        return userService.updateUser(userId, request);
    }


}
