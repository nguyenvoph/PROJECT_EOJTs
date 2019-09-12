package com.example.demo.service;

import com.example.demo.entity.Role;
import com.nimbusds.jwt.JWTClaimsSet;

import java.util.Date;
import java.util.List;

public interface IJwtService {

        String generateTokenLogin(String email, String role);
    //String generateTokenLogin(String email, List<Role> role);

    JWTClaimsSet getClaimsFromToken(String token);

    Date generateExpirationDate();

    Date getExpirationDateFromToken(String token);

    public String getEmailFromToken(String token);

    byte[] generateShareSecret();

    Boolean isTokenExpired(String token);

    Boolean validateTokenLogin(String token);
}
