package com.example.demo.service;

import java.util.ArrayList;
import java.util.Date;

import com.example.demo.entity.Role;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class JwtService implements IJwtService {

    public static final String EMAIL = "email";
    public static final String ROLE = "role";
    public static final String SECRET_KEY = "CAPSTONE_EOJTS_FPTUNIVERSITY_CAPSTONE_EOJTS_FPTUNIVERSITY_CAPSTONE_EOJTS_FPTUNIVERSITY";
    public static final int EXPIRE_TIME = 86400000;

    @Override
    public String generateTokenLogin(String email, String role) {
        String token = null;
        try {
            JWSSigner signer = new MACSigner(generateShareSecret());
            JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder();
            builder.claim(EMAIL, email);

//            List<String> roleDescription = new ArrayList<>();
//            for (int i = 0; i < role.size(); i++) {
//                roleDescription.add(role.get(i).getDescription());
//            }
            builder.claim(ROLE, role);
            //builder.claim(ROLE, roleDescription);
            builder.expirationTime(generateExpirationDate());
            JWTClaimsSet claimsSet = builder.build();
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(signer);
            token = signedJWT.serialize();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return token;
    }


    @Override
    public JWTClaimsSet getClaimsFromToken(String token) {
        JWTClaimsSet claims = null;
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(generateShareSecret());
            if (signedJWT.verify(verifier)) {
                claims = signedJWT.getJWTClaimsSet();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return claims;
    }

    @Override
    public Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + EXPIRE_TIME);
    }

    @Override
    public Date getExpirationDateFromToken(String token) {
        Date expiration = null;
        JWTClaimsSet claims = getClaimsFromToken(token);
        expiration = claims.getExpirationTime();
        return expiration;
    }

    @Override
    public String getEmailFromToken(String token) {
        String email = null;
        try {
            JWTClaimsSet claims = getClaimsFromToken(token);
            email = claims.getStringClaim(EMAIL);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return email;
    }

    @Override
    public byte[] generateShareSecret() {
        byte[] sharedSecret = new byte[32];
        sharedSecret = SECRET_KEY.getBytes();
        return sharedSecret;
    }

    @Override
    public Boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    @Override
    public Boolean validateTokenLogin(String token) {
        if (token == null || token.trim().length() == 0) {
            return false;
        }
        String email = getEmailFromToken(token);

        if (email == null || email.isEmpty()) {
            return false;
        }
        if (isTokenExpired(token)) {
            return false;
        }
        return true;
    }
}
