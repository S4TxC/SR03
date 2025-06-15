package fr.utc.sr03.controller;

import fr.utc.sr03.dto.ChatroomRequest;
import fr.utc.sr03.dto.UsersDTO;
import fr.utc.sr03.model.Chatroom;
import fr.utc.sr03.model.UserChat;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.services.ServicesRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
            @RequestParam(value = "id", required = true) int usersId,
            HttpSession session) {

        Long sessionUserId = (Long) session.getAttribute("userId");
        if (sessionUserId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(servicesRequest.getChatroomsFromUserId(usersId));
    }

    @GetMapping("/myChatrooms")
    public ResponseEntity<List<Chatroom>> getMyUsersChatrooms(
            @RequestParam(value = "id", required = true) int usersId) {
        return ResponseEntity.ok(servicesRequest.getMyChatroomsFromUserId(usersId));
    }

    public static boolean isChatroomValid(Chatroom chatroom) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiration = chatroom.getDate().plusDays(chatroom.getLifespan());
        return now.isBefore(expiration);
    }

    public static boolean isChatroomFutur(Chatroom chatroom) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = chatroom.getDate();
        return now.isBefore(start);
    }

    @GetMapping("/invitedChatrooms")
    public ResponseEntity<List<Chatroom>> getinvitedUsersChatrooms(
            @RequestParam(value = "id", required = true) int usersId) {
        List<Chatroom> listChatroom = servicesRequest.getInvitedChatroomsFromUserId(usersId);
        List<Chatroom> listValideChatroom = new ArrayList<>();
        for (Chatroom chatroom : listChatroom) {
            if (!isChatroomValid(chatroom)) {
                servicesRequest.deleteChatroomAndUserChats(chatroom.getId());
            } else {
                if (!isChatroomFutur(chatroom)) {
                   listValideChatroom.add(chatroom);
                }
            }
        }
        return ResponseEntity.ok(listValideChatroom);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteChatroom(@PathVariable int id) {
        servicesRequest.deleteChatroomAndUserChats(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getChatroomById/{chatroomId}")
    public ResponseEntity<ChatroomRequest> getChatroomById(@PathVariable int chatroomId) {
        ChatroomRequest chatroomRequest = new ChatroomRequest();
        Chatroom chatroom = servicesRequest.getChatroomById(chatroomId);
        List<Users> listUsers = servicesRequest.getUsersFromChatroomId(chatroomId);
        List<UsersDTO> listUsersDTO = new ArrayList<>();

        chatroomRequest.setChannel(chatroom.getChannel());
        chatroomRequest.setDate(chatroom.getDate());
        chatroomRequest.setDescription(chatroom.getDescription());
        chatroomRequest.setLifespan(chatroom.getLifespan());

        for (Users users : listUsers) {
            UsersDTO userDTO = new UsersDTO();
            userDTO.setId(users.getId());
            userDTO.setFirstname(users.getFirstname());
            userDTO.setLastname(users.getLastname());
            listUsersDTO.add(userDTO);
        }

        chatroomRequest.setUsersDTO(listUsersDTO);


        return ResponseEntity.ok(chatroomRequest);
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editChatroom(@RequestBody ChatroomRequest request) {
        Chatroom chatroom = servicesRequest.getChatroomById(request.getId());
        chatroom.setChannel(request.getChannel());
        chatroom.setDate(request.getDate());
        chatroom.setDescription(request.getDescription());
        chatroom.setLifespan(request.getLifespan());

        servicesRequest.updateChatroom(chatroom);
        servicesRequest.deleteUserChatFromChatroomId(request.getId());

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

        return ResponseEntity.ok("Edition reussite !");
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

