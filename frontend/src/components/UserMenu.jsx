import React from "react";
import { Link } from "react-router-dom";
import "./UserMenu.css";

const UserMenu = () => {
    return (
        <div className="home-wrapper">
            <div className="home-container">
                <h1>Bienvenue sur ChatRoom</h1>
                <div className="home-buttons">
                    <Link to="/accueil" className="home-button">Accueil</Link>
                    <Link to="/myChatrooms" className="home-button">Mes Chats</Link>
                    <Link to="/invitedChatrooms" className="home-button">Mes Invitations</Link>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
