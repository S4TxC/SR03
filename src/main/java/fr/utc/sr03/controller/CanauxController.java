package fr.utc.sr03.controller;

import fr.utc.sr03.model.Chatroom;
import fr.utc.sr03.model.UserChat;
import fr.utc.sr03.model.Users;
import fr.utc.sr03.services.ServicesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.ArrayList;

@Controller
public class CanauxController {

    @Autowired
    private ServicesRequest servicesRequest;



    @GetMapping("/chatroom/create")
    public String showCreateChatForm(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(name = "userIds", required = false) List<Integer> userIds,
            Model model) {

        List<Users> users;
        if (search != null && search.isBlank()) {
            users = servicesRequest.getUsers();
        } else {
            users = servicesRequest.searchUsers(search);
        }


        model.addAttribute("chatroom", new Chatroom());
        model.addAttribute("users", users);
        model.addAttribute("search", search);
        model.addAttribute("selectedUserIds", userIds != null ? userIds : new ArrayList<Integer>());

        return "createChatroom";
    }

    @PostMapping("/chatroom/create")
    public String createChannel(
            @ModelAttribute Chatroom chatroom,
            @RequestParam(value = "userIds", required = false) List<Integer> userIds) {

        servicesRequest.addChatroom(chatroom);

        for (int userId : userIds) {
            UserChat userChat = new UserChat();
            userChat.setUser(servicesRequest.getOneUser(userId));
            userChat.setChatroom(chatroom);
            userChat.setIdinvit(servicesRequest.getOneUser(17));
            servicesRequest.addUserChat(userChat);
        }

        return "createChatroom";
    }

    @GetMapping("/myChatRooms")
    public String listChatrooms(Model model) {
        List<UserChat> userChats = servicesRequest.getChatroomsFromUserId(17);
        List<Chatroom> chatrooms = new ArrayList<>();
        for (UserChat userChat : userChats) {
            chatrooms.add(userChat.getChatroom());
        }
        model.addAttribute("myChatRooms", chatrooms);
        return "chatRoomList";
    }


}
