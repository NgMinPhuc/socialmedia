package com.socialmedia.user_service.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.socialmedia.user_service.dto.request.AvatarRequest;
import com.socialmedia.user_service.dto.request.UserCreationRequest;
import com.socialmedia.user_service.dto.request.UserUpdateRequest;
import com.socialmedia.user_service.entity.User;
import com.socialmedia.user_service.exception.AvatarNotFoundException;
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
    
 // upload 
 public void uploadAvatar(String userId, AvatarRequest avatarRequest) throws IOException {
    MultipartFile file = avatarRequest.getFile();
    User user = getUser(userId);
    user.setAvatar(file.getBytes()); // Lưu ảnh dưới dạng byte[]
    userRepository.save(user);
}

// update 
public void updateAvatar(String userId, AvatarRequest avatarRequest) throws IOException {
    MultipartFile file = avatarRequest.getFile();
    User user = getUser(userId);
    user.setAvatar(file.getBytes()); // Cập nhật ảnh
    userRepository.save(user);
}

// delete 
public void deleteAvatar(String userId) {
    User user = getUser(userId);
    byte[] avatar = user.getAvatar();
    
    if (avatar == null || avatar.length == 0) {
        throw new AvatarNotFoundException("Avatar not found");
    }
    
    user.setAvatar(null); // Xóa dữ liệu avatar
    userRepository.save(user);
}

// get 
public byte[] getAvatar(String userId) {
    User user = getUser(userId);
    byte[] avatar = user.getAvatar();
    
    if (avatar == null || avatar.length == 0) {
        throw new AvatarNotFoundException("Avatar not found");
    }
    
    return avatar; // Trả về byte[]
}
}
