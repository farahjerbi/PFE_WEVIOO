package wevioo.tn.backend.entities;

import lombok.Data;

@Data
public class Image {
    private Long id;
    private String value;
    private float height;
    private float width;
    private String position;

    //add cadrage maybe ?
    //add more styling
}
