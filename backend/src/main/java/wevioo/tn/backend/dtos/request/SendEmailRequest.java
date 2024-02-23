package wevioo.tn.backend.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class SendEmailRequest {
   private String [] recipient ;
   private Date time ;
   private MultipartFile attachment;
   private String dynamicValues;
}
