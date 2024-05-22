package wevioo.tn.ms_push.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class WebPushMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    public String title;
    public String clickTarget;
    public String message;
    public String icon;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> placeholders = new HashSet<>();
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> userFavoritePush= new HashSet<>();
}
