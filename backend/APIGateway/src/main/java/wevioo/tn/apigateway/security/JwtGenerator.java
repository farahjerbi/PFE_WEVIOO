package wevioo.tn.apigateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
@Slf4j
public class JwtGenerator {
    @Value("${JWT_EXPIRATION}")
    private Integer JWT_EXPIRATION;
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public boolean validateToken(String token) throws Exception {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            throw new Exception("JWT was expired or incorrect",ex.fillInStackTrace());
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