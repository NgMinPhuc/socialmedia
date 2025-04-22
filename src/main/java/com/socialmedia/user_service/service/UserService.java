package com.socialmedia.user_service.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.socialmedia.user_service.dto.request.UserCreationRequest;
import com.socialmedia.user_service.dto.request.UserUpdateRequest;
import com.socialmedia.user_service.entity.User;
import com.socialmedia.user_service.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    //create user
    public User createUser(UserCreationRequest request) {
        // TODO Auto-generated method stub
        User user = new User();

        user.setUsername(request.getUsername());
        user.setNickname(request.getNickname());
        user.setDob(request.getDob());

        return userRepository.save(user);
    }

    //get user
    public List<User> getUsers() {
        return userRepository.findAll();
    }
     
    //get user by id
    public User getUser(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    //update user
    public User updateUser(String userId, UserUpdateRequest request) {
        User user = getUser(userId);
        user.setUsername(request.getUsername());
        user.setNickname(request.getNickname());
        user.setDob(request.getDob());
        return userRepository.save(user);     

}
}
