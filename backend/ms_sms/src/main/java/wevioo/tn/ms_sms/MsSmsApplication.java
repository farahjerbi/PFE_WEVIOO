package wevioo.tn.ms_sms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsSmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsSmsApplication.class, args);
    }

}
