package wevioo.tn.ms_push;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.security.Security;

@SpringBootApplication
public class MsPushApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsPushApplication.class, args);
    }
}
