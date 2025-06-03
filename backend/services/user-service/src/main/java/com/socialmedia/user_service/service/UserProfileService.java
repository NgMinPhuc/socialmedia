package com.socialmedia.user_service.service;

import com.socialmedia.user_service.dto.request.UserProfileCreationRequest;
import com.socialmedia.user_service.dto.request.UserProfileUpdationRequest;
import com.socialmedia.user_service.dto.response.UserProfileResponse;
import com.socialmedia.user_service.entity.UserProfile;
import com.socialmedia.user_service.exception.AppException;
import com.socialmedia.user_service.exception.ErrorCode;
import com.socialmedia.user_service.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfileResponse createUserProfile(UserProfileCreationRequest request) {
        if (userProfileRepository.existsByAuthenId(request.getAuthenId())) {
            log.warn("Attempt to create user profile with existing authenId: {}", request.getAuthenId());
            throw new AppException(ErrorCode.USER_PROFILE_EXISTS);
        }
        if (userProfileRepository.existsByUsername(request.getUsername())) {
            log.warn("Attempt to create user profile with existing username: {}", request.getUsername());
            throw new AppException(ErrorCode.DUPLICATE_USERNAME);
        }
        if (userProfileRepository.existsByEmail(request.getEmail())) {
            log.warn("Attempt to create user profile with existing email: {}", request.getEmail());
            throw new AppException(ErrorCode.DUPLICATE_EMAIL);
        }

        UserProfile userProfile = UserProfile.builder()
                .authenId(request.getAuthenId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .dob(request.getDob())
                .phoneNumber(request.getPhoneNumber())
                .location(request.getLocation())
                .email(request.getEmail())
                .build();

        UserProfile savedUserProfile = userProfileRepository.save(userProfile);
        log.info("User profile created successfully for authenId: {}", request.getAuthenId());
        return toUserProfileResponse(savedUserProfile);
    }

    @Transactional
    public UserProfileResponse updateUserProfile(UserProfileUpdationRequest request, Jwt principal) {
        String authenId = principal.getSubject();

        UserProfile userProfile = userProfileRepository.findByAuthenId(authenId)
                .orElseThrow(() -> {
                    log.error("User profile not found for authenId: {}", authenId);
                    return new AppException(ErrorCode.USER_PROFILE_NOT_FOUND);
                });

        userProfile.setFirstName(request.getFirstName());
        userProfile.setLastName(request.getLastName());
        userProfile.setDob(request.getDob());
        userProfile.setPhoneNumber(request.getPhoneNumber());
        userProfile.setLocation(request.getLocation());

        UserProfile updatedUserProfile = userProfileRepository.save(userProfile);
        log.info("User profile updated successfully for authenId: {}", authenId);
        return toUserProfileResponse(updatedUserProfile);
    }

    public UserProfileResponse getMyProfile(Jwt principal) {
        String authenId = principal.getSubject();

        UserProfile userProfile = userProfileRepository.findByAuthenId(authenId)
                .orElseThrow(() -> {
                    log.error("User profile not found for authenId: {}", authenId);
                    return new AppException(ErrorCode.USER_PROFILE_NOT_FOUND);
                });

        log.info("Retrieved user profile for authenId: {}", authenId);
        return toUserProfileResponse(userProfile);
    }

    private UserProfileResponse toUserProfileResponse(UserProfile userProfile) {
        return UserProfileResponse.builder()
                .authenId(userProfile.getAuthenId())
                .firstName(userProfile.getFirstName())
                .lastName(userProfile.getLastName())
                .username(userProfile.getUsername())
                .dob(userProfile.getDob())
                .email(userProfile.getEmail())
                .phoneNumber(userProfile.getPhoneNumber())
                .location(userProfile.getLocation())
                .build();
    }
}
