package ServerPackage;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;



public class SocketServer extends Thread {
    private final Socket client;
    private String pseudo;
    private static HashMap<String, Socket> clientsList = new HashMap<>();

    public SocketServer(Socket client, String pseudo) {
        this.client = client;
        this.pseudo = pseudo;
    }

    public void run() {
        try {
            DataInputStream ins=new DataInputStream(client.getInputStream());
            DataOutputStream outs=new DataOutputStream(client.getOutputStream());


            for (int i = 3; i > 0 ; i--) {
                if (clientsList.containsKey(this.pseudo)) {
                    outs.writeUTF("Ce pseudo existe déjà.\nVeuillez en saisir un nouveau.\nIl vous reste "+i+" tentative(s)");
                    outs.flush();
                } else {
                    clientsList.put(this.pseudo, this.client);
                    outs.writeUTF("Vous êtes connecté.");
                    outs.flush();
                    diffuse_msg("\n_______________________\n"+ this.pseudo + " a rejoint la conversation.");
                    break;
                }

                this.pseudo = ins.readUTF();

                if (i == 1) {
                    outs.close();
                    ins.close();
                    this.client.close();
                    return;
                }
            }
            String response = "";
            do {
                response = ins.readUTF();
                if (response.equals("exit")) {
                    diffuse_msg("l’utilisateur "+ this.pseudo + " a quitté la conversation");
                    break;
                } else {
                    response = this.pseudo+ " a dit : " + response;
                    diffuse_msg(response);
                }
            } while(true);

            clientsList.remove(this.pseudo);
            outs.close();
            ins.close();
            this.client.close();

        } catch (IOException ex) {
            System.err.println("Client déconnecté.");
            clientsList.remove(this.pseudo);
        }

    }

    public static void diffuse_msg(String msg) {
        Socket client;
        DataOutputStream outs;
        for (String pseudo : clientsList.keySet()) {
           client = clientsList.get(pseudo);
           try {
               outs =new DataOutputStream(client.getOutputStream());
               outs.writeUTF(msg);
               outs.flush();
           } catch (IOException ex) {
               System.err.println("Client déconnecté.");
           }

        }
    }


    public static void main(String[] args) {

        try {
            ServerSocket server=new ServerSocket(20000);
            System.out.println("Serveur à l'écoute ......");

            while(true) {
                Socket client=server.accept();
                System.out.println("Nouveau client ...");


                DataInputStream ins=new DataInputStream(client.getInputStream());
                DataOutputStream outs=new DataOutputStream(client.getOutputStream());

                String pseudo_client = ins.readUTF();

                SocketServer clientInServer = new SocketServer(client, pseudo_client);
                clientInServer.start();
            }

        } catch (IOException ex) {
            System.err.println("Client déconnecté.");
        }
    }


    public Socket getClient() {
        return client;
    }

    public String getPseudo() {
        return pseudo;
    }
}
