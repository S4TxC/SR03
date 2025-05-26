package fr.utc.sr03.controller;

import fr.utc.sr03.dto.ChatroomRequest;
import fr.utc.sr03.model.Chatroom;
import fr.utc.sr03.model.UserChat;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.services.ServicesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/chatroom")
public class ChatroomRestController {

    @Autowired
    private ServicesRequest servicesRequest;


    @GetMapping("/create")
    public ResponseEntity<Map<String, Object>> getCreateChatroomData(
            @RequestParam(value = "search", required = false) String search) {

        List<Users> users;

        if (search == null || search.isBlank()) {
            users = servicesRequest.getUsers(); // tous les utilisateurs
        } else {
            users = servicesRequest.searchUsers(search); // recherche filtrée
        }

        Map<String, Object> response = new HashMap<>();
        response.put("users", users);

        return ResponseEntity.ok(response); // réponse JSON
    }

    @PostMapping
    public ResponseEntity<Chatroom> createChatroom(@RequestBody ChatroomRequest request) {
        Chatroom chatroom = new Chatroom();
        chatroom.setChannel(request.getChannel());
        chatroom.setDescription(request.getDescription());
        chatroom.setDate(request.getDate());
        chatroom.setLifespan(request.getLifespan());

        servicesRequest.addChatroom(chatroom);

        // Récupérer les utilisateurs sélectionnés
        List<Integer> usersIds = request.getUserIds();

        for (int userId : usersIds) {
            UserChat userChat = new UserChat();
            userChat.setUser(servicesRequest.getOneUser(userId));
            userChat.setChatroom(chatroom);
            userChat.setIdinvit(servicesRequest.getOneUser(17));
            servicesRequest.addUserChat(userChat);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(chatroom);
    }
}
