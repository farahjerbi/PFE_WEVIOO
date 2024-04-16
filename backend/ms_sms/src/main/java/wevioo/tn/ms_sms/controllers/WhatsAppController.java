package wevioo.tn.ms_sms.controllers;

import com.google.gson.JsonObject;
import lombok.AllArgsConstructor;
import okhttp3.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_sms.dtos.request.WhatsAppTemplatePayload;
import wevioo.tn.ms_sms.services.WhatsAppService;

import java.io.IOException;

@RestController
@RequestMapping("/apiWhatsApp")
@AllArgsConstructor
public class WhatsAppController {
    private final WhatsAppService whatsAppService;

    @PostMapping()
    public ResponseEntity<String> createWhatsAppTemplate(@RequestBody WhatsAppTemplatePayload payload) {
        try {
            Response response = whatsAppService.createWhatsAppTemplate(payload);
            if (response.isSuccessful()) {
                return ResponseEntity.ok("WhatsApp template created successfully");
            } else {
                return ResponseEntity.status(response.code()).body(response.message());
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create WhatsApp template: " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<String> getWhatsAppTemplates() {
        try {
            Response response = whatsAppService.getWhatsAppTemplates();
            String responseBody = response.body().string();
            return ResponseEntity.ok(responseBody);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch WhatsApp templates.");
        }
    }

    @DeleteMapping("/{templateName}")
    public ResponseEntity<String> deleteWhatsAppTemplate(
            @PathVariable String templateName
    ) {
        try {
            whatsAppService.deleteWhatsAppTemplate(templateName);
            return ResponseEntity.ok("WhatsApp template deleted successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete WhatsApp template");
        }
    }
}
