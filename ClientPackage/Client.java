package ClientPackage;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.Scanner;
import java.util.logging.Level;


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

    public static void main(String[] args) {
        try {
            // Socket de communication établie entre le serveur et l'hôte localhost sur le port 20000
            Socket clientSocket = new Socket("localhost", 20000);

            DataInputStream in = new DataInputStream(clientSocket.getInputStream());
            DataOutputStream out = new DataOutputStream(clientSocket.getOutputStream());

            Scanner scanner = new Scanner(System.in);

            String response = "";
            for(int i = 0; i < 4 ; i++){
                System.out.println("Entrez un pseudo : ");
                String pseudo = scanner.nextLine();
                out.writeUTF(pseudo);
                response = in.readUTF();
                System.out.println(response);
                if(response.equals("Vous êtes connecté.")){
                    Client client = new Client(clientSocket, pseudo);
                    ClientSendMsg clientSendMsg = new ClientSendMsg(client);
                    ClientReceiveMsg clientReceiveMsg = new ClientReceiveMsg(client);

                    clientSendMsg.start();
                    clientReceiveMsg.start();
                    break;
                }
            }

          //  scanner.close();
        } catch (IOException e) {
            System.err.println("Impossible de se connecter au serveur !");
        }
    }
}
