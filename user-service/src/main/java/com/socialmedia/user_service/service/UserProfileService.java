package com.socialmedia.user_service.service;

import com.socialmedia.user_service.dto.request.UserProfileCreationRequest;
import com.socialmedia.user_service.dto.request.UserProfileUpdationRequest;
import com.socialmedia.user_service.dto.response.UserProfileResponse;
import com.socialmedia.user_service.entity.UserProfile;
import com.socialmedia.user_service.exception.AppException;
import com.socialmedia.user_service.exception.ErrorCode;
import com.socialmedia.user_service.mapper.UserProfileMapper;
import com.socialmedia.user_service.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;

    public UserProfileResponse createUserProfile(UserProfileCreationRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse updateUserProfile(UserProfileUpdationRequest request) {
        UserProfile userProfile = userProfileRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }


    public UserProfileResponse getUserProfile(String userId) {
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public List<UserProfileResponse> getAllUserProfile() {
        List<UserProfile> userProfiles = userProfileRepository.findAll();
        return userProfiles.stream()
                .map(userProfileMapper::toUserProfileResponse)
                .toList();
    }
}
