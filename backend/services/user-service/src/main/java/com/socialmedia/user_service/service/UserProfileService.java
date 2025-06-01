package com.socialmedia.user_service.service;

import com.socialmedia.user_service.dto.request.AvatarUploadRequest;
import com.socialmedia.user_service.dto.request.UserProfileCreationRequest;
import com.socialmedia.user_service.dto.request.UserProfileUpdationRequest;
import com.socialmedia.user_service.dto.response.UserProfileResponse;
import com.socialmedia.user_service.entity.UserProfile;
import com.socialmedia.user_service.exception.AppException;
import com.socialmedia.user_service.exception.ErrorCode;
import com.socialmedia.user_service.mapper.UserProfileMapper;
import com.socialmedia.user_service.repository.UserProfileRepository;
import jakarta.validation.Validator;
import jakarta.validation.ValidationException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileService {

    @Autowired
    final UserProfileRepository userProfileRepository;
    final UserProfileMapper userProfileMapper;
    
    @Value("${app.avatar.max-size:5242880}") // 5MB default
    private long maxAvatarSize;
    
    @Autowired
    private Validator validator;
    
    public UserProfileResponse updateAvatar(AvatarUploadRequest request) {
        // Validate request
        validate(request);
        
        if (request.getAvatar().getSize() > maxAvatarSize) {
            throw new AppException(ErrorCode.AVATAR_SIZE_EXCEEDED);
        }
        
        if (!isImageFile(request.getAvatar())) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }
        
        UserProfile userProfile = userProfileRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        try {
            byte[] avatarBytes = request.getAvatar().getBytes();
            userProfile.setAvatar(avatarBytes);
            userProfile = userProfileRepository.save(userProfile);
            return userProfileMapper.toUserProfileResponse(userProfile);
        } catch (IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
    
    public byte[] getAvatar(String userId) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                
        if (userProfile.getAvatar() == null) {
            throw new AppException(ErrorCode.AVATAR_NOT_FOUND);
        }
        
        return userProfile.getAvatar();
    }
    
    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    private <T> void validate(T object) {
        var violations = validator.validate(object);
        if (!violations.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }

    public UserProfileResponse createUserProfile(UserProfileCreationRequest request) {
        // Validate request
        validate(request);
        
        // Check if user with the given userId already exists
        if (userProfileRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse updateUserProfile(UserProfileUpdationRequest request) {
        // Validate request
        validate(request);
        
        UserProfile userProfile = userProfileRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Map request values to existing userProfile
        UserProfile updatedProfile = userProfileMapper.toUserProfile(request);
        
        // Update existing profile with new values
        if (updatedProfile.getFirstName() != null) userProfile.setFirstName(updatedProfile.getFirstName());
        if (updatedProfile.getLastName() != null) userProfile.setLastName(updatedProfile.getLastName());
        if (updatedProfile.getUserName() != null) userProfile.setUserName(updatedProfile.getUserName());
        if (updatedProfile.getDob() != null) userProfile.setDob(updatedProfile.getDob());
        if (updatedProfile.getPhoneNumber() != null) userProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
        if (updatedProfile.getLocation() != null) userProfile.setLocation(updatedProfile.getLocation());
        if (updatedProfile.getEmail() != null) userProfile.setEmail(updatedProfile.getEmail());
        
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getUserProfile(String userId) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getMyProfile() {
        // Get current user from security context
        String currentUserId = getCurrentUserId();
        UserProfile userProfile = userProfileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public List<UserProfileResponse> getAllUserProfile() {
        List<UserProfile> userProfiles = userProfileRepository.findAll();
        return userProfiles.stream()
                .map(userProfileMapper::toUserProfileResponse)
                .toList();
    }
    
    public void followUser(String targetUserId) {
        // Get current user from security context
        String currentUserId = getCurrentUserId();
        
        UserProfile currentUserProfile = userProfileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                
        UserProfile targetUserProfile = userProfileRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                
        // Using Neo4j specific repository to create relationship
        // This would need a custom query method in the repository
        userProfileRepository.createFollowRelationship(currentUserProfile.getId(), targetUserProfile.getId());
    }
    
    public void unfollowUser(String targetUserId) {
        // Get current user from security context
        String currentUserId = getCurrentUserId();
        
        UserProfile currentUserProfile = userProfileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                
        UserProfile targetUserProfile = userProfileRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Using Neo4j specific repository to delete relationship
        // This would need a custom query method in the repository
        userProfileRepository.deleteFollowRelationship(currentUserProfile.getId(), targetUserProfile.getId());
    }
}
