package wevioo.tn.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admins/")
public class AdminController {


    @GetMapping("demo")
    public ResponseEntity<String> changePassword() {
        return ResponseEntity.ok().build();
    }

}

