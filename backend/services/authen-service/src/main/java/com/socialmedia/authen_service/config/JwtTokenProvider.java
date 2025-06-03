package com.socialmedia.authen_service.config;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.socialmedia.authen_service.entity.User;
import com.socialmedia.authen_service.exception.AppException;
import com.socialmedia.authen_service.exception.ErrorCode;
import com.socialmedia.authen_service.repository.InvalidatedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final InvalidatedTokenRepository invalidatedTokenRepository;

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @Value("${jwt.refresh-duration}")
    protected long REFRESH_DURATION;

    /**
     * Generates a JWT token for the given username.
     *
     * @param user The username to generate the token for.
     * @return The generated JWT token.
     */
    public String generateToken(User user) {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getAuthenId().toString())
                .issuer(user.getUsername())
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS)))
                .jwtID(UUID.randomUUID().toString())
                .build();

        JWSObject jwsObject = new JWSObject(
                new JWSHeader(JWSAlgorithm.HS512),
                new Payload(claims.toJSONObject())
        );

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot creates token", e);
            throw new RuntimeException(e);
        }
    }

    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESH_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.AUTHENTICATION_REQUIRED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.AUTHENTICATION_REQUIRED);

        return signedJWT;
    }

    public String getUsernameFromToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(token, false);
        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

        String username = claimsSet.getIssuer(); // Sửa từ getSubject() sang getIssuer()
        if (username == null || username.trim().isEmpty()) {
            // Trường hợp không tìm thấy username trong claim 'issuer'
            log.warn("Username (issuer claim) not found or empty in token: {}", token);
            throw new AppException(ErrorCode.INVALID_TOKEN); // Hoặc một lỗi phù hợp hơn
        }
        return username;
    }

    public UUID getUserIdFromToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(token, false); // Mặc định là Access Token
        JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

        String subject = claimsSet.getSubject(); // Lấy từ subject claim
        if (subject == null || subject.trim().isEmpty()) {
            log.warn("Subject claim (user ID) not found or empty in token: {}", token);
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format for subject in token: {}", subject, e);
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }
}