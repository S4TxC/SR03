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
            DataInputStream in = new DataInputStream(this.client.getSocket().getInputStream());;
            while (true) {
                System.out.println(in.readUTF());
            }
        } catch (IOException  e) {
            System.out.println("Vous êtes déconnecté.");
        }
    }
}