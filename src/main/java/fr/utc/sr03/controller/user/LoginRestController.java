package fr.utc.sr03.controller.user;

import fr.utc.sr03.dto.LoginRequest;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.repository.UsersRepository;
import fr.utc.sr03.services.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class LoginRestController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Users user = usersRepository.findByEmail(loginRequest.getEmail());
        //Si user existe et password est correct et que user est actif alors connexion autorisée
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()) && user.isStatus()) {
            sessionService.createSession(session, user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            response.put("email", user.getEmail());
            response.put("isAdmin", user.isAdmin());
            response.put("avatarUrl", "/api/user/" + user.getId() + "/avatar");

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body("Successfully logged out");
    }

    //Envoie des infos utiles sur le user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("Not connected");
        }
        Long userId = Long.valueOf(session.getAttribute("userId").toString());
        Users user = usersRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Map<String, Object> safeUserData = new HashMap<>();
        safeUserData.put("id", user.getId());
        safeUserData.put("firstname", user.getFirstname());
        safeUserData.put("lastname", user.getLastname());
        safeUserData.put("email", user.getEmail());
        safeUserData.put("isAdmin", user.isAdmin());
        safeUserData.put("avatarUrl", "/api/user/" + user.getId() + "/avatar");

        return ResponseEntity.ok(safeUserData);
    }

}
