package com.socialmedia.authen_service.service;

import com.nimbusds.jose.JOSEException;
import com.socialmedia.authen_service.config.JwtTokenProvider;
import com.socialmedia.authen_service.config.SecurityConfig;
import com.socialmedia.authen_service.dto.request.*;
import com.socialmedia.authen_service.dto.response.LoginResponse;
import com.socialmedia.authen_service.dto.response.MessageResponse;
import com.socialmedia.authen_service.dto.response.ValidateTokenResponse;
import com.socialmedia.authen_service.entity.InvalidatedToken;
import com.socialmedia.authen_service.entity.User;
import com.socialmedia.authen_service.exception.AppException;
import com.socialmedia.authen_service.exception.ErrorCode;
import com.socialmedia.authen_service.mapper.UserProfileMapper;
import com.socialmedia.authen_service.repository.InvalidatedTokenRepository;
import com.socialmedia.authen_service.mapper.UserMapper;
import com.socialmedia.authen_service.repository.UserRepository;
import com.socialmedia.authen_service.repository.httpClient.UserProfileClient;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.text.ParseException;
import java.util.Date;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    InvalidatedTokenRepository invalidatedTokenRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    UserProfileMapper userProfileMapper;
    JwtTokenProvider jwt;
    SecurityConfig securityConfig;
    UserProfileClient userProfileClient;

    // Login API
    public LoginResponse login(LoginRequest request) {
        
        // Determine the actual input value (username or email)
        String usernameOrEmailInput = request.getUsername() != null ? request.getUsername() : request.getEmail();
        
        User user = userRepository.findByUsernameOrEmailInput(usernameOrEmailInput)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Use the PasswordEncoder bean from SecurityConfig
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS_PASSWORD);
        }

        // Generate JWT tokens (access and refresh tokens)
        var accessToken = jwt.generateToken(user);

        return userMapper.userEntityToLoginResponse(user, accessToken);
    }

    // Register API
    public MessageResponse register(RegisterRequest request) {

        // Check if the user already exists
        if(userRepository.existsByEmailAndUsername(request.getEmail(), request.getUsername())) {
            throw new AppException(ErrorCode.DUPLICATE_USERNAME_OR_EMAIL);
        }

        User user = userMapper.registerRequestMapToUse(request);

        // Encrypt the password
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        // Create user profile in the user service
        var userProfileCreationRequest = userProfileMapper.toUserProfileCreationRequest(request);
        userProfileCreationRequest.setUserId(user.getUserId());
        userProfileCreationRequest.setUserName(user.getUsername());
        userProfileCreationRequest.setEmail(user.getEmail());

        var userProfileResponse = userProfileClient.createUserProfile(userProfileCreationRequest);

        //log.info(userProfileResponse.toString());

        userMapper.userToRegisterResponse(user);

        return MessageResponse.builder()
                .message("User registered successfully")
                .build();
    }

    // Refresh Token API
    public LoginResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = jwt.verifyToken(request.getRefreshToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder()
                        .id(jit)
                        .expiredAt(expiryTime)
                        .build();

        invalidatedTokenRepository.save(invalidatedToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();

        var user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        var token = jwt.generateToken(user);

        return LoginResponse.builder()
                .username(user.getUsername())
                .accessToken(token)
                .build();
    }

    // Logout API
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = jwt.verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder()
                            .id(jit)
                            .expiredAt(expiryTime)
                            .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }

    // Validate Token API
    public ValidateTokenResponse validateToken(ValidateTokenRequest validateToken) throws ParseException, JOSEException {
        boolean isValid = true;

        try{
            jwt.verifyToken(validateToken.getToken(), false);
        }catch (AppException exception){
            isValid = false;
        }

        return ValidateTokenResponse.builder()
                .valid(isValid)
                .build();
    }

    // Change Password API
    public void changePassword(String token, @Valid ChangePasswordRequest request) throws ParseException, JOSEException {

        String username = jwt.getUsernameFromToken(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS_PASSWORD);
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new AppException(ErrorCode.PASSWORDS_DO_NOT_MATCH);
        }

        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());

        user.setPassword(encodedNewPassword);
        userRepository.save(user);
    }
}