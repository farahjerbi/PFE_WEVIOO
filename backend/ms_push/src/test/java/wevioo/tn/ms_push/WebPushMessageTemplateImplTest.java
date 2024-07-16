package wevioo.tn.ms_push;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import nl.martijndwars.webpush.Notification;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import wevioo.tn.ms_push.dtos.request.*;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;
import wevioo.tn.ms_push.repositories.SubscriptionRepository;
import wevioo.tn.ms_push.repositories.WebPushMessageTemplateRepository;
import wevioo.tn.ms_push.services.FileStorageService;
import wevioo.tn.ms_push.services.WebPushMessageTemplate;
import wevioo.tn.ms_push.services.WebPushMessageTemplateImpl;
import wevioo.tn.ms_push.services.WebPushMessageUtil;
import nl.martijndwars.webpush.PushService;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.*;
import java.util.concurrent.ExecutionException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class WebPushMessageTemplateImplTest {

    @InjectMocks
    private WebPushMessageTemplateImpl webPushMessageTemplate;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private WebPushMessageTemplateRepository webPushMessageTemplateRepository;

    @Mock
    private WebPushMessageUtil webPushMessageUtil;
    @Mock
    private PushService pushService;

    private static final String PUBLIC_KEY = "BOdufZ-xvfmjBHSA8YEl0oVxLbf6wNPgQuHngrjJI1q8rZkMF2x-ZrJ7to0s_jTr8Q9HVDY0pcIfaMTEu1L8XfU";
    private static final String PRIVATE_KEY = "xOGXMLirxOEePoZREJvHvQIciurMQS0SSr16np0eNG0";
    private static final String SUBJECT = "test";

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        Security.addProvider(new BouncyCastleProvider());

    }

    @Test
    public void testCreatePushTemplate() {
        WebPushMessageAdd messageAdd = new WebPushMessageAdd();
        messageAdd.setMessage("Test Message");
        messageAdd.setTitle("Test Title");
        messageAdd.setClickTarget("http://example.com");
        messageAdd.setIcon(null);

        Set<String> placeholders = new HashSet<>(Arrays.asList("user", "time"));
        when(webPushMessageUtil.extractPlaceholders(anyString())).thenReturn(placeholders);

        WebPushMessage expectedMessage = new WebPushMessage();
        expectedMessage.setPlaceholders(placeholders);
        expectedMessage.setMessage("Test Message {{user}} , {{time}}");
        expectedMessage.setTitle("Test Title");
        expectedMessage.setClickTarget("http://example.com");

        when(webPushMessageTemplateRepository.save(any(WebPushMessage.class))).thenReturn(expectedMessage);

        WebPushMessage result = webPushMessageTemplate.createPushTemplate(messageAdd);

        assertEquals("Test Message {{user}} , {{time}}", result.getMessage());
        assertEquals("Test Title", result.getTitle());
        assertEquals("http://example.com", result.getClickTarget());
        assertEquals(placeholders, result.getPlaceholders());

        verify(webPushMessageTemplateRepository, times(1)).save(any(WebPushMessage.class));
    }

    @Test
    public void testUpdatePushTemplate() {
        Long id = 1L;
        WebPushMessageUpdate messageUpdate = new WebPushMessageUpdate();
        messageUpdate.setMessage("Updated Title {{user}} , {{time}}");
        messageUpdate.setTitle("Updated Title");
        messageUpdate.setClickTarget("http://updated.com");
        messageUpdate.setIcon(null);

        WebPushMessage existingMessage = new WebPushMessage();
        existingMessage.setId(id);

        Set<String> placeholders = new HashSet<>(Arrays.asList("user", "time"));
        when(webPushMessageTemplateRepository.findById(id)).thenReturn(Optional.of(existingMessage));
        when(webPushMessageUtil.extractPlaceholders(anyString())).thenReturn(placeholders);
        when(webPushMessageTemplateRepository.save(any(WebPushMessage.class))).thenReturn(existingMessage);

        WebPushMessage result = webPushMessageTemplate.updatePushTemplate(messageUpdate, id);

        assertEquals("Updated Title {{user}} , {{time}}", result.getMessage());
        assertEquals("Updated Title", result.getTitle());
        assertEquals("http://updated.com", result.getClickTarget());
        assertEquals(placeholders, result.getPlaceholders());

        verify(webPushMessageTemplateRepository, times(1)).findById(id);
        verify(webPushMessageTemplateRepository, times(1)).save(any(WebPushMessage.class));
    }

    @Test
    public void testDeletePushTemplate() {
        Long id = 1L;
        WebPushMessage existingMessage = new WebPushMessage();
        existingMessage.setId(id);
        existingMessage.setIcon("icon.png");

        when(webPushMessageTemplateRepository.findById(id)).thenReturn(Optional.of(existingMessage));

        webPushMessageTemplate.deletePushTemplate(id);

        verify(fileStorageService, times(1)).deleteFile("icon.png");
        verify(webPushMessageTemplateRepository, times(1)).deleteById(id);
    }

    @Test
    public void testToggleFavoritePush() {
        Long pushTemplateId = 1L;
        Long userId = 1L;

        WebPushMessage pushTemplate = new WebPushMessage();
        pushTemplate.setId(pushTemplateId);
        Set<Long> favoriteUsers = new HashSet<>(Collections.singletonList(userId));
        pushTemplate.setUserFavoritePush(favoriteUsers);

        when(webPushMessageTemplateRepository.findById(pushTemplateId)).thenReturn(Optional.of(pushTemplate));

        webPushMessageTemplate.toggleFavoritePush(pushTemplateId, userId);

        assertFalse(pushTemplate.getUserFavoritePush().contains(userId));

        verify(webPushMessageTemplateRepository, times(1)).save(pushTemplate);
    }


}
