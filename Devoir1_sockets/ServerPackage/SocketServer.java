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

            //Vérification si le pseudo existe déjà (3 essais possibles):
            //      Si oui : alors on redemande à l'utilisateur une nouvelle saisie
            //      Sinon : on lui dit qu'il est connecté et il rejoint la conversation
            for (int i = 3; i >= 0 ; i--) {
                this.pseudo = ins.readUTF();
                if (clientsList.containsKey(this.pseudo)) {
                    if (i != 0) {
                        outs.writeUTF("Ce pseudo existe déjà.\nVeuillez en saisir un nouveau.\nIl vous reste "+i+" tentative(s)");
                        outs.flush();
                    }
                    else {
                        //Déconnexion du client à la fin des 3 essais
                        outs.writeUTF("Le nombre maximal d'essais a été atteint.");
                        outs.flush();
                        this.closeClient(ins, outs);
                        return;
                    }
                } else {
                    clientsList.put(this.pseudo, this.client);
                    outs.writeUTF("Vous êtes connecté.");
                    outs.flush();
                    outs.writeUTF("\n_______________________\n");
                    outs.flush();
                    diffuseMsg(this.pseudo + " a rejoint la conversation.");
                    break;
                }
            }
            //Réception des messages du client.
            String response = "";
            do {
                response = ins.readUTF();
                //Si le client a envoyé "exit" alors on le supprime de la liste des clients, on le deconnecte et on diffuse le message de déconnexion.
                if (response.equals("exit")) {
                    clientsList.remove(this.pseudo);
                    this.closeClient(ins, outs);
                    diffuseMsg("l’utilisateur "+ this.pseudo + " a quitté la conversation");
                    break;
                } else {
                    //Diffusion du message du client.
                    response = this.pseudo+ " a dit : " + response;
                    diffuseMsg(response);
                }
            } while(true);

            //Traitement de la déconnexion du client sans que le serveur soit prévenu.
        } catch (IOException ex) {
            System.err.println("Client déconnecté.");
            clientsList.remove(this.pseudo);
            try {
                this.client.close();
                diffuseMsg("l’utilisateur "+ this.pseudo + " a quitté la conversation");
            } catch (IOException e) {
                //throw new RuntimeException(e);
            }
        }

    }

    //Diffusion de msg sur tous les clients.
    public static void diffuseMsg(String msg) throws IOException{
        Socket client;
        DataOutputStream outs;
        for (String pseudo : clientsList.keySet()) {
           client = clientsList.get(pseudo);
            outs =new DataOutputStream(client.getOutputStream());
            outs.writeUTF(msg);
            outs.flush();

        }
    }

    //Ferme le Socket client, le DataInputStream et le DataOutputStream.
    private void closeClient(DataInputStream ins, DataOutputStream outs) throws IOException {
        outs.close();
        ins.close();
        this.client.close();
    }


    public static void main(String[] args) {
        try {
            ServerSocket server=new ServerSocket(20000);
            System.out.println("Serveur à l'écoute ......");

            while(true) {
                Socket client=server.accept();
                System.out.println("Nouveau client ...");

                SocketServer clientInServer = new SocketServer(client, "");
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
