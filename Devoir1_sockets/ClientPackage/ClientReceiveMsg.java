package ClientPackage;

import java.io.DataInputStream;
import java.io.IOException;

public class ClientReceiveMsg extends Thread {

    private Client client;

    public ClientReceiveMsg(Client client) {
        this.client = client;
    }

    public void run() {
        try {
            DataInputStream in = new DataInputStream(this.client.getSocket().getInputStream());
            //Attendre les messages du serveur et les afficher.
            while (true) {
                System.out.println(in.readUTF());
            }

            //Traitement de la déconnexion du serveur sans que le client soit prévenu.
        } catch (IOException  e) {
            System.out.println("Vous êtes déconnecté.");
        }
    }
}