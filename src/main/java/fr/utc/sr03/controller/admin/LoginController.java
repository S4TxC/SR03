package fr.utc.sr03.controller.admin;

import fr.utc.sr03.dto.LoginRequest;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.repository.UsersRepository;
import fr.utc.sr03.services.SessionService;
import jakarta.servlet.http.HttpSession;
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

    @Autowired
    private SessionService sessionService;

    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "loginPage";
    }

    @PostMapping("/login")
    public String login(LoginRequest loginRequest, Model model, HttpSession session) {
        Users user = usersRepository.findByEmail(loginRequest.getEmail());

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Crée la session avec les infos importantes
            sessionService.createSession(session, user);
            return user.isAdmin() ? "redirect:/admin" : "redirect:/home";
        }

        model.addAttribute("loginRequest", loginRequest);
        model.addAttribute("error", true);
        return "loginPage";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:http://localhost:3000/login";
    }
}
