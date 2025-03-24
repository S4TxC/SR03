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

            //Saisir un pseudo tant que le serveur refuse le pseudo saisie précedement.
            String response = "";
            for(int i = 0; i <= 3 ; i++){
                System.out.println("Entrez un pseudo : ");
                String pseudo = scanner.nextLine();
                out.writeUTF(pseudo);
                response = in.readUTF();
                System.out.println(response);

                //Le serveur a validé le pseudo.
                if(response.equals("Vous êtes connecté.")){

                    //Création d'un objet Client, ClientSendMsg et ClientReceiveMsg.
                    Client client = new Client(clientSocket, pseudo);
                    ClientSendMsg clientSendMsg = new ClientSendMsg(client);
                    ClientReceiveMsg clientReceiveMsg = new ClientReceiveMsg(client);

                    //Lancement d'un thread pour envoyer au serveur les messages de l'utilisateur et un autre pour
                    // intercepter les messages du serveur.
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
