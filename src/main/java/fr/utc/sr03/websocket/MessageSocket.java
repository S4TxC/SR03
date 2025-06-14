package fr.utc.sr03.websocket;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MessageSocket {

    private String user;
    private String message;
    private String imageUrl;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @JsonProperty("imageUrl")
    public String getImageUrl() { return imageUrl; }

    @JsonProperty("imageUrl")
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
