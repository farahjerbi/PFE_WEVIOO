package wevioo.tn.ms_auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
@Component
@Slf4j
public class JwtGenerator {
    @Value("${JWT_EXPIRATION}")
    private Long JWT_EXPIRATION;
    private final Key key;
    public JwtGenerator(@Value("${SECRET_KEY}") String secretKey) {
        try {
            byte[] decodedKey = Base64.getDecoder().decode(secretKey);
            this.key = new SecretKeySpec(decodedKey, SignatureAlgorithm.HS512.getJcaName());
        } catch (IllegalArgumentException e) {
            log.error("Failed to decode SECRET_KEY: {}", e.getMessage());
            throw e;
        }

        log.debug("Initialized JwtGenerator with SECRET_KEY: {}", secretKey);
    }


    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + JWT_EXPIRATION);
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.equals("ADMIN") || authority.equals("USER"))
                .findFirst()
                .orElse("USER");

        String token = Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt( new Date())
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        System.out.println("New token :");
        System.out.println(token);
        return token;
    }

    public String generateSimpleToken(String email) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + JWT_EXPIRATION);
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt( new Date())
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

    }

    public String getUsernameFromJWT(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        System.out.println(key);

        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            log.error("Exception while validating JWT: {}", ex.getMessage());
            return false;
        }
    }

}