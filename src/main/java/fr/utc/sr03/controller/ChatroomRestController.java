package fr.utc.sr03.controller;

import fr.utc.sr03.dto.ChatroomRequest;
import fr.utc.sr03.dto.UsersDTO;
import fr.utc.sr03.model.Chatroom;
import fr.utc.sr03.model.UserChat;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.services.ServicesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/chatroom")
public class ChatroomRestController {

    @Autowired
    private ServicesRequest servicesRequest;


   /* @GetMapping("/create")
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
    }*/

    @GetMapping("/allChatrooms")
    public ResponseEntity<List<Chatroom>> getAllUsersChatrooms(
            @RequestParam(value = "id", required = true) int usersId) {
        return ResponseEntity.ok(servicesRequest.getChatroomsFromUserId(usersId));
    }

    @GetMapping("/myChatrooms")
    public ResponseEntity<List<Chatroom>> getMyUsersChatrooms(
            @RequestParam(value = "id", required = true) int usersId) {
        return ResponseEntity.ok(servicesRequest.getMyChatroomsFromUserId(usersId));
    }

    @GetMapping("/invitedChatrooms")
    public ResponseEntity<List<Chatroom>> getinvitedUsersChatrooms(
            @RequestParam(value = "id", required = true) int usersId) {
        return ResponseEntity.ok(servicesRequest.getInvitedChatroomsFromUserId(usersId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteChatroom(@PathVariable int id) {
        servicesRequest.deleteChatroom(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Chatroom> createChatroom(@RequestBody ChatroomRequest request) {
        Chatroom chatroom = new Chatroom();
        chatroom.setChannel(request.getChannel());
        chatroom.setDescription(request.getDescription());
        chatroom.setDate(request.getDate());
        chatroom.setLifespan(request.getLifespan());

        servicesRequest.addChatroom(chatroom);

        // Récupérer les utilisateurs sélectionnés
        List<Integer> usersIds = request.getUserIds();
        int idInvit = request.getIdInvit();
        System.out.println(idInvit);
        Users userInvit = servicesRequest.getOneUser(idInvit);

        for (int userId : usersIds) {
            UserChat userChat = new UserChat();
            userChat.setUser(servicesRequest.getOneUser(userId));
            userChat.setChatroom(chatroom);
            userChat.setIdinvit(userInvit);
            servicesRequest.addUserChat(userChat);
        }

        UserChat userChat = new UserChat();
        userChat.setUser(userInvit);
        userChat.setChatroom(chatroom);
        userChat.setIdinvit(userInvit);
        servicesRequest.addUserChat(userChat);

        return ResponseEntity.status(HttpStatus.CREATED).body(chatroom);
    }

    @GetMapping("/searchUsers")
    public ResponseEntity<List<UsersDTO>> searchUsers
            (@RequestParam(value = "search", required = true) String search) {
        List<Users> res = servicesRequest.searchUsers(search);
        List<UsersDTO> listUsersDTO = new ArrayList<>();

        for (Users user : res) {
            UsersDTO uDTO = new UsersDTO();
            uDTO.setId(user.getId());
            uDTO.setLastname(user.getLastname());
            uDTO.setFirstname(user.getFirstname());
            listUsersDTO.add(uDTO);
        }
        return ResponseEntity.ok(listUsersDTO);
    }

}

