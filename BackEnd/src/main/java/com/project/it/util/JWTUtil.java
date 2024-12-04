package com.project.it.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

import javax.crypto.SecretKey;
import java.io.UnsupportedEncodingException;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
public class JWTUtil {
    //JWT 문자열 생성, 검증
    private static String key = "1234567890123456789012345678901234567890"; //30자 이상
    //token 문자열 생성
    public static String generateToken(Map<String, Object> valueMap, int min){
        SecretKey key = null;

        try {
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage());
        }
        String jwtStr = Jwts.builder()
                .setHeader(Map.of("typ", "JWT"))
                .setClaims(valueMap)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
                .signWith(key)
                .compact();
        return jwtStr;
    }
    //token 문자열 검증
    public static Map<String, Object> validationToken(String token){
        Map<String, Object> claim = null;

        try {
            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
            claim = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token) //파싱 및 검증, 실패 시 에러
                    .getBody();
        } catch (MalformedJwtException malformedJwtException) {
            throw new CustomJWTException("MalFormed");
        }catch (ExpiredJwtException expiredJwtException) {
            throw new CustomJWTException("Expired");
        }catch (InvalidClaimException invalidClaimException) {
            throw new CustomJWTException("Invalid");
        }catch (JwtException jwtException) {
            throw new CustomJWTException("JWTError");
        }catch (Exception e) {
            throw new CustomJWTException("Error");
        }
        return claim;
    }
}
