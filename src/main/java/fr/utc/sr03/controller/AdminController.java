package fr.utc.sr03.controller;


import fr.utc.sr03.model.Users;
import fr.utc.sr03.services.ServicesRequest;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
public class AdminController {

    @Resource
    private ServicesRequest servicesRequest;

    @GetMapping("/admin")
    public String adminPage(@RequestParam(value = "search", required = false) String search,
                            @RequestParam(value = "page", defaultValue = "0") int page,
                            @RequestParam(value = "size", defaultValue = "5") int size,
                            Model model) {

        Page<Users> users;
        int totalPages = 1;

        if (search != null && !search.isBlank()) {
            users = servicesRequest.searchUsers(search, page, size);
            totalPages = servicesRequest.getTotalPagesForSearch(search, size);
        } else {
            users = servicesRequest.getUsers(page, size);
            totalPages = servicesRequest.getTotalPages(size);
        }

        model.addAttribute("myusers", users);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("search", search);

        int previousPage = (page > 0) ? page - 1 : 0;
        int nextPage = (page + 1 < totalPages) ? page + 1 : totalPages - 1;

        model.addAttribute("previousPage", previousPage);
        model.addAttribute("nextPage", nextPage);

        return "admin";
    }

    @GetMapping("/admin/users/delete/{id}")
    public String deleteUser(@PathVariable int id,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(required = false) String search) {

        servicesRequest.deleteOneUser(id); // supprime l'utilisateur (via JPA)

        return "redirect:/admin?page=" + page +
                (search != null && !search.isEmpty() ? "&search=" + search : "");
    }

    @GetMapping("/admin/users/edit/{id}")
    public String showEditForm(@PathVariable int id, Model model) {
        Users user = servicesRequest.getOneUser(id);

        model.addAttribute("user", user);
        return "editUser";
    }

    @PostMapping("/admin/users/update/{id}")
    public String updateUser(@PathVariable int id, @ModelAttribute Users user,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(required = false) String search) {

        Users existingUser = servicesRequest.getOneUser(id);
        existingUser.setFirstname(user.getFirstname());
        existingUser.setLastname(user.getLastname());
        existingUser.setEmail(user.getEmail());
        existingUser.setAdmin(user.isAdmin());
        existingUser.setStatus(user.isStatus());

        servicesRequest.updateUser(existingUser); // Sauvegarder les modifications dans la DB

        return "redirect:/admin?page=" + page +
                (search != null && !search.isEmpty() ? "&search=" + search : "");
    }

}
