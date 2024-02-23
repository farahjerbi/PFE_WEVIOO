package wevioo.tn.backend.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Data
public class ScheduleEmailRequest {
    @Email
    private String email;

    private Long templateId;

    private Map<String,String> placeHolders;

    private LocalDateTime dateTime;

    private ZoneId timeZone;

    private MultipartFile attachment;
}
