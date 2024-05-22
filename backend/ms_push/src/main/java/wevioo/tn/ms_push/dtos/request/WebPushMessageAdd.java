package wevioo.tn.ms_push.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class WebPushMessageAdd {
        public String title;
        public String clickTarget;
        public String message;
        public MultipartFile icon;
}
