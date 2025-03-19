package Classes;

import java.net.Socket;

public class Client {
    private final Socket socket;
    private String pseudo;

    public Client(Socket socket, String pseudo) {
        this.socket = socket;
        this.pseudo = pseudo;
    }

    public String getPseudo() {
        return pseudo;
    }

    public Socket getSocket() {
        return socket;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }
}
