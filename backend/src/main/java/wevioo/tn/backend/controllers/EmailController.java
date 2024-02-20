package wevioo.tn.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.repositories.EmailTemplateRepository;
import wevioo.tn.backend.services.email.EmailTemplateService;


@RestController
@RequestMapping("/api/auth/")
public class EmailController {

    @Autowired
    private EmailTemplateService emailTemplateService;
    @Autowired
    private EmailTemplateRepository emailTemplateRepository;
    @Autowired
    private EmailTemplateService emailService;

    @PostMapping("addTemplate")
    public ResponseEntity<EmailTemplate> createEmailTemplate(@RequestBody EmailTemplate emailTemplate) {
        EmailTemplate createdEmailTemplate = emailTemplateService.createEmailTemplate(emailTemplate);
        return ResponseEntity.ok(createdEmailTemplate);
    }
    @PostMapping("assignTemplateBody/{emailTemplateId}")
    public ResponseEntity<String> assignTemplateBodyToEmailTemplate(@PathVariable Long emailTemplateId, @RequestBody TemplateBody templateBody) {
        EmailTemplate emailTemplate = emailTemplateRepository.getReferenceById(emailTemplateId);

        if (emailTemplate == null) {
            return ResponseEntity.notFound().build();
        }

        emailTemplateService.assignTemplateBodyToEmailTemplate(templateBody, emailTemplate);
        return ResponseEntity.ok("TemplateBody assigned to EmailTemplate successfully.");
    }

    @GetMapping("hey/{emailTemplateId}")
    public ResponseEntity<EmailTemplate> getEmailById(@PathVariable Long emailTemplateId) {
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);

        return ResponseEntity.ok(emailTemplate);
    }

    @PostMapping("sendEmail/{emailTemplateId}")
    public ResponseEntity<?> sendEmail(@PathVariable Long emailTemplateId) {
        try {
            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);

            if (emailTemplate == null) {
                return ResponseEntity.ok("Email template not found.");
            }

            emailService.sendHtmlEmailWithEmbeddedFiles(emailTemplate);
            return ResponseEntity.ok().body("Email sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }


}

