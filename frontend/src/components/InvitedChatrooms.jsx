import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Chatrooms.css";

const InvitedChatrooms = () => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
        if (user) {
            axios
                .get(`http://localhost:8080/api/chatroom/invitedChatrooms?id=${user.id}`)
                .then((res) => setInvitations(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    return (
        <div className="page-container">
            <h2>Mes Invitations</h2>
            <div className="chat-list">
                {invitations.map((chat) => (
                    <div key={chat.id} className="chat-card">
                        <div className="chat-info">
                            <h3>{chat.channel}</h3>
                            <p>{chat.description}</p>
                        </div>
                        <div className="chat-actions">
                            <Link to={`/chat/${chat.id}`}><button className="view">Voir</button></Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvitedChatrooms;
