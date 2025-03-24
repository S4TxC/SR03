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

        //Attendre une entrée clavier de l'utilisateur tant qu'il ne souhaite pas stopper la conversation.
        try {
            DataOutputStream out = new DataOutputStream(this.client.getSocket().getOutputStream());;
            do {
                msg = scanner.nextLine();
                out.writeUTF(msg);
            } while (!"exit".equals(msg));

        scanner.close();

            //Traitement de la déconnexion du serveur sans que le client soit prévenu.
        } catch (IOException e) {
            System.err.println("Le serveur n'est plus disponible.");
            scanner.close();
        }
    }
}

