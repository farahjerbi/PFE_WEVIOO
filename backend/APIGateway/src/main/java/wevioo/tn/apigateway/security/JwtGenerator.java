package wevioo.tn.apigateway.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;

@Slf4j
@Component
public class JwtGenerator {
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

    public boolean validateToken(String token) {
        System.out.println(key);

        try {
            log.debug("Validating token...");
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            log.debug("Token validated successfully.");
            return true;
        } catch (ExpiredJwtException ex) {
            log.error("JWT expired: {}", ex.getMessage());
            return false;
        } catch (UnsupportedJwtException | MalformedJwtException | IllegalArgumentException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
            return false;
        } catch (SecurityException ex) {
            log.error("JWT security exception: {}", ex.getMessage());
            return false;
        } catch (Exception ex) {
            log.error("Exception while validating JWT: {}", ex.getMessage());
            return false;
        }
    }


    public Claims getClaimsFromJWT(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}