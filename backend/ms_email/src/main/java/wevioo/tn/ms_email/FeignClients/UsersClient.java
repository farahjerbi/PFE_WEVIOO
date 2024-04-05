package wevioo.tn.ms_email.FeignClients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import wevioo.tn.ms_email.dtos.response.UserResponse;

@FeignClient(name = "ms-auth",url = "http://localhost:8090")
public interface UsersClient {
    @GetMapping("/api/users/getUserById/{id}")
     UserResponse getUserById(@PathVariable("id") Long id);
}
