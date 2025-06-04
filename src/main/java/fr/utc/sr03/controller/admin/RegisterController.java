package fr.utc.sr03.controller.admin;

import fr.utc.sr03.dto.RegisterRequest;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller

public class RegisterController {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String RegisterForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String RegisterPost(@ModelAttribute("registerRequest") RegisterRequest request, Model model) {
        if (usersRepository.findByEmail(request.getEmail()) != null) {
            model.addAttribute("error", "Email déjà utilisé.");
            return "register";
        }

        Users newUser = new Users();
        newUser.setFirstname(request.getFirstname());
        newUser.setLastname(request.getLastname());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // hachage ici
        newUser.setAdmin(false); // par défaut non admin
        newUser.setStatus(true);

        usersRepository.save(newUser);
        return "redirect:http://localhost:8080/admin";
    }
}