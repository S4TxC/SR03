import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Chatrooms.css";

const MyChatrooms = () => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (user) {
            axios
                .get(`http://localhost:8080/api/chatroom/myChatrooms?id=${user.id}`)
                .then((res) => setChats(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    return (
        <div className="page-container">
            <h2>Mes Chats</h2>
            <div className="chat-list">
                {chats.map((chat) => (
                    <div key={chat.id} className="chat-card">
                        <div className="chat-info">
                            <h3>{chat.channel}</h3>
                            <p>{chat.description}</p>
                        </div>
                        <div className="chat-actions">
                            <Link to={`/chat/${chat.id}`}><button className="view">Voir</button></Link>
                            <button className="edit">Modifier</button>
                            <button className="delete">Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyChatrooms;
