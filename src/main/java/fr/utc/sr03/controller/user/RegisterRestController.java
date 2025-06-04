package fr.utc.sr03.controller.user;

import fr.utc.sr03.dto.RegisterRequest;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class RegisterRestController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        // Vérifier si email déjà utilisé
        if (usersRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email address already in use.");
        }

        Users newUser = new Users();
        newUser.setFirstname(request.getFirstname());
        newUser.setLastname(request.getLastname());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setAdmin(false);  // Toujours false pour les users normaux
        newUser.setStatus(true);  // actif par défaut

        usersRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
    }
}
