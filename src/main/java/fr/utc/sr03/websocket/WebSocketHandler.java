package fr.utc.sr03.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jboss.logging.Logger;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WebSocketHandler extends TextWebSocketHandler {

    private final String nameChat;
    private final Logger logger = Logger.getLogger(WebSocketHandler.class.getName());
    private final HashMap<String, List<WebSocketSession>> sessions;
    private final HashMap<String, List<MessageSocket>> messageSocketsHistory;

    public WebSocketHandler(String nameChat) {
        this.nameChat = nameChat;
        this.messageSocketsHistory = new HashMap<>();
        this.sessions = new HashMap<>();
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        String receivedMessage = (String) message.getPayload();
        MessageSocket messageSocket = mapper.readValue(receivedMessage, MessageSocket.class);
        String roomName = getRoomName(session);
        List<MessageSocket> listMessage;

        //Pour stocker le message dans l'historique
        if (messageSocketsHistory.containsKey(roomName)) {
            listMessage = messageSocketsHistory.get(roomName);
        } else {
            listMessage = new ArrayList<>();
        }
        listMessage.add(messageSocket);
        messageSocketsHistory.put(roomName, listMessage);
        //messageSocketsHistory.add(messageSocket);

        //Envoi du message à tous les connectés
        this.broadcast(roomName, messageSocket.getUser()+ " : " + messageSocket.getMessage());

    }
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        //On stocke la session du client dans une liste
        String roomName = getRoomName(session);
        List<WebSocketSession> listSessions;

        if (sessions.containsKey(roomName)) {
            listSessions = sessions.get(roomName);
            listSessions.add(session);
        } else {
            listSessions = new ArrayList<>();
            listSessions.add(session);
        }
        sessions.put(roomName, listSessions);
      //  sessions.add(session);
        logger.info(session.getId());

       /* //J'affiche l'historique du salon
        for(MessageSocket messageSocket : messageSocketsHistory){
            session.sendMessage(new TextMessage(messageSocket.getUser()+ " : " + messageSocket.getMessage()));
        }*/

        logger.info("Connecté sur le " + roomName);

    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String roomName = getRoomName(session);
        List<WebSocketSession> listSession =  sessions.get(roomName);
        listSession.remove(session);

        //Quand le client quitte, on retire sa session
        sessions.put(roomName, listSession);
        //sessions.remove(session);
        logger.info("Déconnecté du " + this.nameChat);

    }

    public void broadcast(String room, String message) throws IOException {
        List<WebSocketSession> listSession =  sessions.get(room);
        for (WebSocketSession session : listSession) {
            session.sendMessage(new TextMessage(message));
        }
    }

    private static String getRoomName(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null && query.startsWith("room=")) {
            return query.substring(5);
        }
        return "default";
    }
}
