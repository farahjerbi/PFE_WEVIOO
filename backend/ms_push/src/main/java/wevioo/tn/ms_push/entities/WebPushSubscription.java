package wevioo.tn.ms_push.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class WebPushSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String notificationEndPoint;
    private String publicKey;
    private String auth;
    private Long userId;

    public WebPushSubscription(String endpoint1, String publicKey1, String auth1) {
    }
}
