package com.socialmedia.user_service.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.socialmedia.user_service.dto.request.AvatarRequest;
import com.socialmedia.user_service.dto.request.UserCreationRequest;
import com.socialmedia.user_service.dto.request.UserUpdateRequest;
import com.socialmedia.user_service.entity.User;
import com.socialmedia.user_service.repository.UserRepository;

import java.nio.file.Path;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // create user
    public User createUser(UserCreationRequest request) {
        User user = new User();

        user.setFirstName(request.getFirstname());
        user.setLastName(request.getLastname());
        user.setLocation(request.getLocation());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setNickname(request.getNickname());
        user.setDob(request.getDob());

        return userRepository.save(user);
    }

    // get user by id
    public User getUser(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // update user
    public User updateUser(String userId, UserUpdateRequest request) {
        User user = getUser(userId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setLocation(request.getLocation());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setNickname(request.getNickname());
        user.setDob(request.getDob());

        return userRepository.save(user);

    }

    // service about avatar
    
   private final String avatarDirectory = "C:/Users/kim/image";

    // upload 
    public String uploadAvatar(String userId, AvatarRequest avatarRequest) throws IOException {
        MultipartFile file = avatarRequest.getFile();
        String avatarUrl = saveImage(file);
        User user = getUser(userId);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;
    }

    // update 
    public String updateAvatar(String userId, AvatarRequest avatarRequest) throws IOException {
        MultipartFile file = avatarRequest.getFile();
        User user = getUser(userId);
        String avatarUrl = saveImage(file);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;
    }

    // delete 
    public void deleteAvatar(String userId) {
        User user = getUser(userId);
        String avatarUrl = user.getAvatarUrl();
        File file = new File(avatarUrl);
        if (file.exists()) {
            file.delete();
        }
        user.setAvatarUrl(null);
        userRepository.save(user);
    }

    // get 
    public String getAvatar(String userId) {
        User user = getUser(userId);
        return user.getAvatarUrl();
    }

    private String saveImage(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(avatarDirectory, fileName);
        Files.copy(file.getInputStream(), filePath);
        return filePath.toString();
    }

}
