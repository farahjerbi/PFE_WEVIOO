package wevioo.tn.ms_sms;

import com.infobip.ApiClient;
import com.infobip.ApiException;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import wevioo.tn.ms_sms.dtos.request.*;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.openFeign.UsersClient;
import wevioo.tn.ms_sms.repositories.SmsRepository;
import wevioo.tn.ms_sms.services.SmsServiceImpl;
import wevioo.tn.ms_sms.services.SmsUtils;


import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


public class SmsServiceImplTest {

    @Mock
    private SmsRepository smsRepository;


    @Mock
    private SmsUtils smsUtils;

    @Mock
    private ApiClient apiClient;

    @Mock
    private UsersClient usersClient;


    @InjectMocks
    private SmsServiceImpl smsService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        smsService = new SmsServiceImpl(smsRepository, usersClient, smsUtils, apiClient);
    }

    @Test
    public void testCreateSmsTemplate() {
        SmsTemplate smsTemplate = new SmsTemplate();
        smsTemplate.setContent("Hello, {name}!");

        Set<String> placeholders = new HashSet<>(Collections.singletonList("{name}"));
        when(smsUtils.extractPlaceholders(smsTemplate.getContent())).thenReturn(placeholders);
        when(smsRepository.save(any(SmsTemplate.class))).thenReturn(smsTemplate);

        SmsTemplate result = smsService.createSmsTemplate(smsTemplate);

        assertEquals(placeholders, result.getPlaceholders());
        verify(smsRepository, times(1)).save(smsTemplate);
    }

    @Test
    public void testUpdateSmsTemplate() {
        Long id = 1L;
        UpdateSmsTemplate updateSmsTemplate = new UpdateSmsTemplate();
        updateSmsTemplate.setSubject("New Subject");
        updateSmsTemplate.setContent("New Content ");
        updateSmsTemplate.setLanguage("EN");

        SmsTemplate existingTemplate = new SmsTemplate();
        existingTemplate.setId(id);
        existingTemplate.setContent("Old Content");

        Set<String> placeholders = new HashSet<>(Collections.singleton("{newPlaceholder}"));
        when(smsRepository.findById(id)).thenReturn(Optional.of(existingTemplate));
        when(smsUtils.extractPlaceholders(updateSmsTemplate.getContent())).thenReturn(placeholders);
        when(smsRepository.save(any(SmsTemplate.class))).thenReturn(existingTemplate);

        SmsTemplate result = smsService.updateSmsTemplate(updateSmsTemplate, id);

        assertEquals(updateSmsTemplate.getSubject(), result.getSubject());
        assertEquals(updateSmsTemplate.getContent(), result.getContent());
        assertEquals(updateSmsTemplate.getLanguage(), result.getLanguage());
        assertEquals(placeholders, result.getPlaceholders());
        verify(smsRepository, times(1)).save(existingTemplate);
    }

    @Test
    public void testDeleteSmsTemplate() {
        Long id = 1L;
        smsService.deleteSmsTemplate(id);
        verify(smsRepository, times(1)).deleteById(id);
    }

    @Test
    public void testSendSms() {
        Long templateId = 1L;
        SendsSms sendsSms = new SendsSms();
        sendsSms.setIdTemplate(templateId);
        sendsSms.setNumbers(Arrays.asList("1234567890", "0987654321"));
        sendsSms.setPlaceholderValues(Map.of("name", "John"));

        SmsTemplate smsTemplate = new SmsTemplate();
        smsTemplate.setId(templateId);
        smsTemplate.setSubject("Subject");
        smsTemplate.setContent("Hello, {name}!");

        when(smsRepository.findById(templateId)).thenReturn(Optional.of(smsTemplate));
        when(smsUtils.replacePlaceholders(eq(smsTemplate.getContent()), anyMap()))
                .thenReturn("Hello, John");
        when(smsUtils.isValidPhoneNumber(anyString())).thenReturn(true);

        String result = smsService.sendSms(sendsSms);

        assertEquals("Message sent successfully", result);
        verify(smsRepository, times(1)).findById(templateId);
        verify(smsUtils, times(1)).replacePlaceholders(eq(smsTemplate.getContent()), eq(sendsSms.getPlaceholderValues()));
    }

    @Test
    public void testToggleFavoriteSMS() {
        Long smsTemplateId = 1L;
        Long userId = 2L;

        SmsTemplate smsTemplate = new SmsTemplate();
        smsTemplate.setId(smsTemplateId);
        smsTemplate.setUserFavoriteSms(new ArrayList<>(List.of(userId)));

        when(smsRepository.findById(smsTemplateId)).thenReturn(Optional.of(smsTemplate));

        smsService.toggleFavoriteSMS(smsTemplateId, userId);
        assertFalse(smsTemplate.getUserFavoriteSms().contains(userId));

        smsService.toggleFavoriteSMS(smsTemplateId, userId);
        assertTrue(smsTemplate.getUserFavoriteSms().contains(userId));

        verify(smsRepository, times(2)).save(smsTemplate);
    }

    @Test
    public void testSendSmsSeparately() throws ApiException {
        Long templateId = 1L;
        SendIndiv sendsSms = new SendIndiv();
        sendsSms.setIdTemplate(templateId);
        List<SendSeparately> sendSeparatelyList = new ArrayList<>();
        sendSeparatelyList.add(new SendSeparately("1234567890", Map.of("name", "John")));
        sendSeparatelyList.add(new SendSeparately("0987654321", Map.of("name", "Doe")));
        sendsSms.setSendSeparatelyList(sendSeparatelyList);

        SmsTemplate smsTemplate = new SmsTemplate();
        smsTemplate.setId(templateId);
        smsTemplate.setSubject("Subject");
        smsTemplate.setContent("Hello, {name}!");

        when(smsRepository.findById(templateId)).thenReturn(Optional.of(smsTemplate));
        when(smsUtils.replacePlaceholders(eq(smsTemplate.getContent()), anyMap()))
                .thenReturn("Hello, John")
                .thenReturn("Hello, Doe");
        when(smsUtils.isValidPhoneNumber(anyString())).thenReturn(true);

        String result = smsService.sendSmsSeparately(sendsSms);

        assertEquals("Message sent successfully", result);
        verify(smsRepository, times(1)).findById(templateId);
        verify(smsUtils, times(2)).replacePlaceholders(eq(smsTemplate.getContent()), anyMap());
    }

}