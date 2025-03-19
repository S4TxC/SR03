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
            DataInputStream in;
            do {
                in = new DataInputStream(this.client.getSocket().getInputStream());
                System.out.println(in.readUTF());
            } while (true);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}