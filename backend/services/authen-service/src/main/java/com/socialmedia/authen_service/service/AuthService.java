package com.socialmedia.authen_service.service;

import com.nimbusds.jose.JOSEException;
import com.socialmedia.authen_service.config.JwtTokenProvider;
import com.socialmedia.authen_service.dto.request.*;
import com.socialmedia.authen_service.dto.response.*;
import com.socialmedia.authen_service.entity.InvalidatedToken;
import com.socialmedia.authen_service.entity.User;
import com.socialmedia.authen_service.exception.AppException;
import com.socialmedia.authen_service.exception.ErrorCode;
import com.socialmedia.authen_service.repository.InvalidatedTokenRepository;
import com.socialmedia.authen_service.repository.UserRepository;
import com.socialmedia.authen_service.httpClient.UserProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    InvalidatedTokenRepository invalidatedTokenRepository;
    UserRepository userRepository;
    JwtTokenProvider jwtTokenProvider;
    PasswordEncoder passwordEncoder;
    UserProfileClient userProfileClient;

    public LoginResponse login(LoginRequest request) {
        String usernameOrEmailInput = request.getUsername() != null ? request.getUsername() : request.getEmail();

        User user = userRepository.findByUsernameOrEmailInput(usernameOrEmailInput)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS_PASSWORD);
        }

        var accessToken = jwtTokenProvider.generateToken(user);

        return LoginResponse.builder()
                .authenId(user.getAuthenId().toString())
                .username(user.getUsername())
                .accessToken(accessToken)
                .build();
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if(userRepository.existsByEmailAndUsername(request.getEmail(), request.getUsername())) {
            throw new AppException(ErrorCode.DUPLICATE_USERNAME_OR_EMAIL);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);

        UserProfileCreationRequest userProfileCreationRequest = UserProfileCreationRequest.builder()
                .authenId(user.getAuthenId().toString())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(user.getUsername())
                .dob(request.getDob())
                .email(user.getEmail())
                .location(request.getLocation())
                .phoneNumber(request.getPhoneNumber())
                .build();

        userProfileClient.createUserProfile(userProfileCreationRequest);

        return RegisterResponse.builder()
                .authenticated(true)
                .authenId(user.getAuthenId().toString())
                .username(user.getUsername())
                .build();
    }

    @Transactional
    public RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedRefreshToken = jwtTokenProvider.verifyToken(request.getRefreshToken(), true);

        var jti = signedRefreshToken.getJWTClaimsSet().getJWTID();
        var expiryTime = signedRefreshToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedRefreshToken =
                InvalidatedToken.builder()
                        .id(jti)
                        .expiredAt(expiryTime)
                        .build();
        invalidatedTokenRepository.save(invalidatedRefreshToken);

        var username = signedRefreshToken.getJWTClaimsSet().getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        var newAccessToken = jwtTokenProvider.generateToken(user);
        var newRefreshToken = jwtTokenProvider.generateToken(user);

        return RefreshResponse.builder()
                .newAccessToken(newAccessToken)
                .newRefreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public ChangePasswordResponse changePassword(UUID authenId, ChangePasswordRequest request) { // Changed 'String token' to 'String username'
        // We already have the username from the AuthenticationPrincipal in the controller.
        // No need to parse a token again here to get the username.

        User user = userRepository.findByAuthenId(authenId) // Use the 'username' parameter directly
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS_PASSWORD);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword);
        userRepository.save(user);

        // --- IMPORTANT: Invalidate all existing tokens for this user after password change ---
        // This is a critical security step. If a user changes their password, any old tokens
        // should be invalidated to force them to log in again with the new password.
        // This prevents old tokens from being used by someone who might have stolen them.
        // You would typically store JWT IDs (JTI) of active tokens or use a revocation list.
        // Example (needs implementation in InvalidatedTokenRepository/AuthService):
        // invalidateAllTokensForUser(user.getAuthenId());

        return ChangePasswordResponse.builder()
                .success(true)
                .message("Password changed successfully. Please re-login with your new password.")
                .build();
    }

    @Transactional
    public LogoutResponse logout(LogoutRequest request) throws ParseException, JOSEException {
        return null;
    }

    public ValidateTokenResponse validateToken(ValidateTokenRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        var signedJWT = jwtTokenProvider.verifyToken(token, false);

        String userId = signedJWT.getJWTClaimsSet().getStringClaim("userId");

        boolean isInvalidated = invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID());

        return ValidateTokenResponse.builder()
                .valid(!isInvalidated)
                .build();
    }

}