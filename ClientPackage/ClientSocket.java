package ClientPackage;

import Classes.Client;
import java.io.IOException;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ClientSocket {
    private static final Logger LOGGER = Logger.getLogger(ClientSocket.class.getName());

    public static void main(String[] args) {
        try {
            // Socket de communication établie entre le serveur et l'hôte localhost sur le port 20000
            Socket clientSocket = new Socket("localhost", 20000);

            // Création d'un objet pour envoyer les messages au serveur
            clientMsg msg = new clientMsg(clientSocket);
            msg.run();

        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Erreur", e);
        }
    }
}