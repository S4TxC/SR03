package fr.utc.sr03.controller.user;

import fr.utc.sr03.model.Users;
import fr.utc.sr03.services.ServicesRequest;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
public class UserRestController {

    @Resource
    private ServicesRequest servicesRequest;

    @GetMapping("/all")
    public ResponseEntity<?> getUsers(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "sortField", defaultValue = "id") String sortField,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir
    ) {
        Page<Users> users;
        if (search != null && !search.isBlank()) {
            users = servicesRequest.searchUsersSorted(search, page, size, sortField, sortDir);
        } else {
            users = servicesRequest.getUsersSorted(page, size, sortField, sortDir);
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        Users user = servicesRequest.getOneUser(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<byte[]> getAvatar(@PathVariable Long id) throws IOException {
        Users user = servicesRequest.getOneUser(Math.toIntExact(id));
        byte[] imageBytes;

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (user.getAvatar() != null) {
            imageBytes = user.getAvatar();
        } else {
            ClassPathResource defaultImage = new ClassPathResource("static/img/default-profile.jpeg");
            imageBytes = StreamUtils.copyToByteArray(defaultImage.getInputStream());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody Users updatedUser, HttpSession session) {
        Users existingUser = servicesRequest.getOneUser(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        Integer sessionId = (Integer) session.getAttribute("userId");
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        if (!idEqualsOrAdmin(sessionId, id, isAdmin)) {
            return ResponseEntity.status(403).body("Accès refusé");
        }

        existingUser.setFirstname(updatedUser.getFirstname());
        existingUser.setLastname(updatedUser.getLastname());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setStatus(updatedUser.isStatus());

        servicesRequest.updateUser(existingUser);
        return ResponseEntity.ok(existingUser);
    }


    private boolean idEqualsOrAdmin(Integer sessionId, int targetId, Boolean isAdmin) {
        return sessionId != null && (sessionId == targetId || Boolean.TRUE.equals(isAdmin));
    }
}
