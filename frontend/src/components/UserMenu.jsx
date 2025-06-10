import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";
import "./UserMenu.css";

const UserMenu = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        // La redirection sera gérée automatiquement par le contexte d'authentification
    };

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <div className="user-info">
                    <h1>Bienvenue {user ? user.firstname : "sur ChatRoom"}</h1>
                    {user && (
                        <p className="user-details">
                            {user.firstname} {user.lastname} ({user.email})
                        </p>
                    )}
                </div>

                <div className="home-buttons">
                    <Link to="/accueil" className="home-button">Accueil</Link>
                    <Link to="/myChatrooms" className="home-button">Mes Chats</Link>
                    <Link to="/invitedChatrooms" className="home-button">Mes Invitations</Link>
                    <Link to="/createChatroom" className="home-button">Créer une Chatroom</Link>
                </div>

                <div className="logout-section">
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;