package src.main.java.fr.utc.sr03.model;

import jakarta.persistence.*;

@Entity
@Table(name = "UserChat")
public class UserChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iduc")
    private int iduc;

    @ManyToOne
    @JoinColumn(name = "idu")
    private User user;

    @ManyToOne
    @JoinColumn(name = "idc")
    private Chatroom chatroom;

    // Getters et Setters

    public int getIduc() {return iduc;}

    public void setIduc(int iduc) {this.iduc = iduc;}

    public User getUser() {return user;}

    public void setUser(User user) {this.user = user;}

    public Chatroom getChatroom() {return chatroom;}

    public void setChatroom(Chatroom chatroom) {this.chatroom = chatroom;}
}
