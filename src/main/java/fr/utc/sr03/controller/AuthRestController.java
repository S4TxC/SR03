package fr.utc.sr03.controller;

import fr.utc.sr03.dto.LoginRequest;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.repository.UsersRepository;
import fr.utc.sr03.services.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class AuthRestController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Users user = usersRepository.findByEmail(loginRequest.getEmail());


        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            sessionService.createSession(session, user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("email", user.getEmail());
            response.put("isAdmin", user.isAdmin());
            response.put("name", user.getFirstname() + " " + user.getLastname());
            response.put("id", user.getId());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
