package fr.utc.sr03.controller;

import fr.utc.sr03.dto.LoginRequest;
import fr.utc.sr03.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "loginPage";
    }

    @PostMapping("/login")
    public String login(LoginRequest loginRequest, Model model) {
        var user = usersRepository.findByEmail(loginRequest.getEmail());

        // Vérifie si l'utilisateur existe et si le mot de passe est correct
        if (user != null && user.isAdmin() && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return "redirect:/admin";  // Redirige vers la page d'admin si l'utilisateur est un admin
        }

        // Si login échoue, retourne la page de login avec un message d'erreur
        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("error", true);
        return "loginPage";
    }
}
