package ClientPackage;

import java.io.DataOutputStream;
import java.io.IOException;
import java.util.Scanner;

public class ClientSendMsg extends Thread {
    // private static final Logger LOGGER = Logger.getLogger(ClientSocket.class.getName());

    private Client client;

    public ClientSendMsg(Client client) {
        this.client = client;
    }

    public void run() {
        Scanner scanner = new Scanner(System.in);
        String msg = "";

        try {
            DataOutputStream out;
            do {
                out = new DataOutputStream(this.client.getSocket().getOutputStream());
                msg = scanner.nextLine();
                out.writeUTF(msg);
            } while (!"exit".equals(msg));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

