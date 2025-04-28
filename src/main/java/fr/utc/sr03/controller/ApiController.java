package fr.utc.sr03.controller;


import fr.utc.sr03.model.User;
import fr.utc.sr03.services.JakartaEmail;
import fr.utc.sr03.services.ServicesRequest;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ApiController {

    @Resource
    private ServicesRequest servicesRequest;


    @PostMapping(value = "/create")
    public void create(){


        User user = new User();
        user.setFirstname("Cédric");
        user.setLastname("Martinet");
        user.setMail("cedric.martinet@utc.fr");
        servicesRequest.addUser(user);
    }

    @GetMapping(value = "/liste")
    public List<User> getUsers(){
        return servicesRequest.getUsers();
    }

    @GetMapping(value = "/testmail")
    public void sendMail(){
        JakartaEmail jakartaEmail = new JakartaEmail();
        jakartaEmail.sendMail();
    }


}
