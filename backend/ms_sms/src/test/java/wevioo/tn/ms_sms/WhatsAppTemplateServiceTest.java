package wevioo.tn.ms_sms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infobip.ApiClient;

import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import wevioo.tn.ms_sms.dtos.request.SendWhatsAppMsg;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;
import wevioo.tn.ms_sms.services.SmsUtils;
import wevioo.tn.ms_sms.services.WhatsAppTemplateService;

import java.io.IOException;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class WhatsAppTemplateServiceTest {

    private WhatsAppTemplateService whatsAppTemplateService;
    private OkHttpClient client;
    private ApiClient infobipApiClient;
    private SmsUtils smsUtils;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        client = mock(OkHttpClient.class);
        infobipApiClient = mock(ApiClient.class);
        smsUtils = mock(SmsUtils.class);
        objectMapper = new ObjectMapper();

        // Initialize the service with mocked dependencies
        whatsAppTemplateService = new WhatsAppTemplateService(client, infobipApiClient, smsUtils);
    }

    @Test
    public void testGetWhatsAppTemplates() throws IOException {
        // Mock the response
        Response mockResponse = new Response.Builder()
                .request(new Request.Builder().url("https://api.example.com").build())
                .protocol(Protocol.HTTP_1_1)
                .code(200)
                .message("OK")
                .body(ResponseBody.create("[]", MediaType.get("application/json")))
                .build();

        // Mock Call object
        Call mockCall = mock(Call.class);
        when(client.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);

        // Call the method under test
        Response response = whatsAppTemplateService.getWhatsAppTemplates();

        assertNotNull(response);
        assertTrue(response.isSuccessful());
        assertEquals("[]", response.body().string());
    }


    @Test
    public void testGetWhatsAppTemplateById() throws Exception {
        Long templateId = 1L;
        String jsonResponse = "{\"language\":\"en\", \"name\":\"Test Template\"}"; // Sample JSON response

        // Create a mock Response using Response.Builder
        Response mockResponse = new Response.Builder()
                .request(new Request.Builder().url("https://api.example.com").build())
                .protocol(Protocol.HTTP_1_1)
                .code(200)
                .message("OK")
                .body(ResponseBody.create(jsonResponse, MediaType.parse("application/json")))
                .build();

        // Mock Call object
        Call mockCall = mock(Call.class);
        when(client.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);

        WhatsAppTemplateResponse result = whatsAppTemplateService.getWhatsAppTemplateById(templateId);

        assertNotNull(result);
        assertEquals("en", result.getLanguage());
        assertEquals("Test Template", result.getName());
    }

    @Test
    public void testSendSmsWhatsAppInvalidNumber() {
        SendWhatsAppMsg sendWhatsAppMsg = new SendWhatsAppMsg();
        sendWhatsAppMsg.setNumbers(Arrays.asList("invalid_number"));
        sendWhatsAppMsg.setPlaceholders(Arrays.asList("John"));

        when(smsUtils.isValidPhoneNumber("invalid_number")).thenReturn(false);

        String result = whatsAppTemplateService.sendSmsWhatsApp(sendWhatsAppMsg);

        assertEquals("Invalid phone number: invalid_number", result);
    }


    @Test
    public void testSendSmsWhatsApp() {
        SendWhatsAppMsg sendWhatsAppMsg = new SendWhatsAppMsg();
        sendWhatsAppMsg.setNumbers(Arrays.asList("1234567890"));
        sendWhatsAppMsg.setPlaceholders(Arrays.asList("John"));

        WhatsAppTemplateResponse templateResponse = new WhatsAppTemplateResponse();
        templateResponse.setLanguage("en");
        templateResponse.setName("Test Template");
        sendWhatsAppMsg.setWhatsAppTemplateResponse(templateResponse);

        when(smsUtils.isValidPhoneNumber("1234567890")).thenReturn(true);


        String result = whatsAppTemplateService.sendSmsWhatsApp(sendWhatsAppMsg);

        assertEquals("WhatsApp messages sent successfully", result);
        verify(smsUtils, times(1)).isValidPhoneNumber("1234567890");
        verify(infobipApiClient, times(1));
    }


}