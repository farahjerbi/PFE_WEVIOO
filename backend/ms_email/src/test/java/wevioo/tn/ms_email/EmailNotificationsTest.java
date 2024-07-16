package wevioo.tn.ms_email;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.quartz.*;

import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.ms_email.FeignClients.UsersClient;
import wevioo.tn.ms_email.controllers.EmailController;
import wevioo.tn.ms_email.dtos.request.UpdateEmailTemplateRequest;
import wevioo.tn.ms_email.dtos.response.ScheduledEmailInfo;
import wevioo.tn.ms_email.dtos.response.UserResponse;
import wevioo.tn.ms_email.entities.EmailTemplate;
import wevioo.tn.ms_email.entities.State;
import wevioo.tn.ms_email.entities.TemplateBody;
import wevioo.tn.ms_email.repositories.EmailTemplateRepository;
import wevioo.tn.ms_email.services.EmailTemplateService;
import wevioo.tn.ms_email.services.EmailTemplateServiceImpl;
import wevioo.tn.ms_email.services.TemplateUtils;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.powermock.api.mockito.PowerMockito.whenNew;

@RunWith(PowerMockRunner.class)
@PrepareForTest({ EmailTemplateServiceImpl.class, MimeMessageHelper.class })
public class EmailNotificationsTest {

    @Mock
    private Scheduler scheduler;
    @Mock
    private EmailTemplateRepository emailTemplateRepository;

    @Mock
    private UsersClient usersClient;

    @Mock
    private TemplateUtils templateUtils;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailTemplateServiceImpl emailTemplateService;

    @InjectMocks
    private EmailController emailTemplateController;

    private ObjectMapper objectMapper;
    @Mock
    private SchedulerFactoryBean schedulerFactory;
    private static final String JOB_GROUP = "group1";
    private TemplateBody emailTemplate;
    private EmailTemplate template;


    private UserResponse user;
    @Mock
    private MimeMessageHelper mimeMessageHelper;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        // Mocking scheduler and other components
        when(scheduler.getJobGroupNames()).thenReturn(Arrays.asList("group1"));
        EmailTemplateService emailTemplateService = new EmailTemplateServiceImpl(emailTemplateRepository, templateUtils, usersClient);
        emailTemplateController = new EmailController(emailTemplateService, emailTemplateRepository, templateUtils, scheduler, usersClient);
        when(schedulerFactory.getScheduler()).thenReturn(mock(Scheduler.class));

        // Mocking UserResponse
        user = new UserResponse();
        user.setEmail("farah.jeerbi@gmail.com");
        user.setEmailSecret("crji rjxx hwfj cecp");
        user.setSignature("signature.png");

        // Mocking TemplateBody
        emailTemplate = new TemplateBody();
        emailTemplate.setSubject("Test Subject");
        emailTemplate.setContent("Hello, {{name}}!");
        emailTemplate.setTags(true);

        // Mocking JavaMailSender and MimeMessage
        when(templateUtils.personalJavaMailSender(anyString(), anyString())).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Mocking MimeMessageHelper
        whenNew(MimeMessageHelper.class).withAnyArguments().thenReturn(mimeMessageHelper);

        template = new EmailTemplate();
        template.setUserFavoriteEmails(new ArrayList<>());
    }

    @Test
    public void testCreateEmailTemplate() {
        EmailTemplate emailTemplate = new EmailTemplate();
        emailTemplate.setTemplateBody(new TemplateBody());
        emailTemplate.getTemplateBody().setContent("@email");

        when(emailTemplateRepository.save(any(EmailTemplate.class))).thenReturn(emailTemplate);

        EmailTemplate result = emailTemplateService.createEmailTemplate(emailTemplate);

        assertEquals(emailTemplate, result);
        verify(emailTemplateRepository, times(1)).save(emailTemplate);
    }

    @Test
    public void testGetTemplatesLikedByUser() {
        List<EmailTemplate> templates = Arrays.asList(new EmailTemplate(), new EmailTemplate());
        when(emailTemplateRepository.findTemplatesByUserFavoriteEmailsContains(anyLong())).thenReturn(templates);

        List<EmailTemplate> response = emailTemplateController.getTemplatesLikedByUser(1L);

        assertEquals(2, response.size());
        verify(emailTemplateRepository, times(1)).findTemplatesByUserFavoriteEmailsContains(1L);
    }

    @Test
    public void testListScheduledEmailsSuccess() throws Exception {
        // Prepare mock data
        JobKey jobKey = JobKey.jobKey("job1", "group1");
        JobDetail jobDetail = mock(JobDetail.class);
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("templateId", 1L);
        jobDataMap.put("userId", 123L);
        jobDataMap.put("replyTo", "reply@example.com");
        jobDataMap.put("addSignature", "true");
        jobDataMap.put("requestBody", "{\"key\":\"value\"}");
        jobDataMap.put("recipients", "recipient1@example.com");
        jobDataMap.put("cc", "cc@example.com");

        when(jobDetail.getJobDataMap()).thenReturn(jobDataMap);
        when(scheduler.getJobDetail(jobKey)).thenReturn(jobDetail);
        when(scheduler.getJobGroupNames()).thenReturn(Collections.singletonList("group1"));
        when(scheduler.getJobKeys(GroupMatcher.jobGroupEquals("group1"))).thenReturn(Collections.singleton(jobKey));

        EmailTemplate emailTemplate = new EmailTemplate();
        emailTemplate.setName("Template Name");
        when(emailTemplateRepository.findEmailTemplateWithDetails(1L)).thenReturn(emailTemplate);

        UserResponse userResponse = new UserResponse();
        userResponse.setFirstName("John");
        userResponse.setLastName("Doe");
        when(usersClient.getUserById(123L)).thenReturn(userResponse);

        // Execute the method
        ResponseEntity<List<ScheduledEmailInfo>> response = emailTemplateController.listScheduledEmails(123L);

        // Assertions
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    public void testListScheduledEmailsSchedulerException() throws Exception {
        when(scheduler.getJobGroupNames()).thenThrow(new SchedulerException("Scheduler error"));

        ResponseEntity<List<ScheduledEmailInfo>> response = emailTemplateController.listScheduledEmails(123L);

        assertEquals(500, response.getStatusCodeValue());
    }

    @Test
    public void testDeleteScheduledEmailNotFound() throws SchedulerException {
        String jobName = "job1";

        // Mocking behavior
        when(scheduler.checkExists(JobKey.jobKey(jobName, JOB_GROUP))).thenReturn(false);

        // Execute the method
        ResponseEntity<String> response = emailTemplateController.deleteScheduledEmail(jobName);

        // Assertions
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Job not found.", response.getBody());

        // Verify that deleteJob was not called
        verify(scheduler, never()).deleteJob(any(JobKey.class));
    }

    @Test
    public void testSendEmailSuccess() throws Exception {
        // Mocking user response
        user = new UserResponse();
        user.setEmail("farah.jeerbi@gmail.com");
        user.setEmailSecret("crji rjxx hwfj cecp");
        user.setSignature("signature.png");

        when(usersClient.getUserById(anyLong())).thenReturn(user);
        when(templateUtils.personalJavaMailSender(anyString(), anyString())).thenReturn(mailSender);
        when(templateUtils.replacePlaceholders(anyString(), anyMap())).thenReturn("Hello, User!");

        // Setup input
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", "User");
        String[] recipients = {"recipient@example.com"};

        // Call the method
        emailTemplateService.sendEmail(emailTemplate, requestBody, null, recipients, null, "replyTo@example.com", 1L, "false");

        // Verify interactions
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        verify(usersClient, times(1)).getUserById(anyLong());
    }

    @Test
    public void testSendEmailWithAttachment() throws Exception {
        // Mocking
        when(usersClient.getUserById(anyLong())).thenReturn(user);
        when(templateUtils.personalJavaMailSender(anyString(), anyString())).thenReturn(mailSender);
        when(templateUtils.replacePlaceholders(anyString(), anyMap())).thenReturn("Hello, User!");

        // Setup input
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("name", "User");
        String[] recipients = {"recipient@example.com"};
        MultipartFile attachment = new MockMultipartFile("file", "test.txt", "text/plain", "Test content".getBytes());

        // Call the method
        emailTemplateService.sendEmail(emailTemplate, requestBody, attachment, recipients, null, "replyTo@example.com", 1L, "false");

        // Verify interactions
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        verify(usersClient, times(1)).getUserById(anyLong());
        verify(templateUtils, times(1)).addAttachment(any(MultipartFile.class), any(MimeMultipart.class));
    }

    @Test
    public void testUpdateEmailTemplate_Success() {
        Long id = 1L;
        UpdateEmailTemplateRequest updatedTemplate = new UpdateEmailTemplateRequest();
        updatedTemplate.setName("Updated Template");
        updatedTemplate.setState(State.SIMPLE);
        updatedTemplate.setLanguage("en");
        updatedTemplate.setContent("Updated Content");
        updatedTemplate.setSubject("Updated Subject");

        EmailTemplate emailTemplate = new EmailTemplate();
        emailTemplate.setId(id);
        emailTemplate.setName("Old Template");
        emailTemplate.setState(State.SIMPLE);
        emailTemplate.setLanguage("fr");
        emailTemplate.setTemplateBody(new TemplateBody());

        when(emailTemplateRepository.findEmailTemplateWithDetails(id)).thenReturn(emailTemplate);

        String result = emailTemplateService.updateEmailTemplate(id, updatedTemplate, new Object());

        verify(emailTemplateRepository).save(emailTemplate);
        assertEquals("Template updated successfully", result);
    }

    @Test
    public void testToggleFavoriteEmail_AddToFavorites() {
        Long emailTemplateId = 1L;
        Long userId = 100L;

        when(emailTemplateRepository.findById(emailTemplateId)).thenReturn(java.util.Optional.of(template));

        emailTemplateService.toggleFavoriteEmail(emailTemplateId, userId);

        verify(emailTemplateRepository).save(template);
        assertTrue(template.getUserFavoriteEmails().contains(userId));
    }

    @Test
    public void testToggleFavoriteEmail_RemoveFromFavorites() {
        Long emailTemplateId = 1L;
        Long userId = 100L;
        template.getUserFavoriteEmails().add(userId);

        when(emailTemplateRepository.findById(emailTemplateId)).thenReturn(java.util.Optional.of(template));

        emailTemplateService.toggleFavoriteEmail(emailTemplateId, userId);

        verify(emailTemplateRepository).save(template);
        assertFalse(template.getUserFavoriteEmails().contains(userId));
    }

    @Test
    public void testToggleFavoriteEmail_TemplateNotFound() {
        Long emailTemplateId = 1L;
        Long userId = 100L;

        when(emailTemplateRepository.findById(emailTemplateId)).thenReturn(java.util.Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            emailTemplateService.toggleFavoriteEmail(emailTemplateId, userId);
        });

        assertEquals("Email template not found with id: " + emailTemplateId, exception.getMessage());
    }
}