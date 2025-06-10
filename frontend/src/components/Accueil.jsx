import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";
import "./Chatrooms.css";

const Accueil = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadChats = async () => {
            if (!user?.id) {
                console.log('❌ Pas d\'utilisateur pour charger les chats');
                setLoading(false);
                return;
            }

            try {
                console.log('🔄 Chargement des chats pour:', user.email);
                setLoading(true);
                setError(null);

                // Utiliser l'ID de l'utilisateur depuis la session
                const response = await axios.get(
                    `http://localhost:8080/api/chatroom/allChatrooms?id=${user.id}`
                );

                console.log('✅ Chats chargés:', response.data);
                setChats(response.data);
            } catch (err) {
                console.error('❌ Erreur chargement chats:', err);

                if (err.response?.status === 401) {
                    setError("Session expirée. Veuillez vous reconnecter.");
                } else {
                    setError("Erreur lors du chargement des chats");
                }
            } finally {
                setLoading(false);
            }
        };

        loadChats();
    }, [user]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Veuillez vous connecter pour voir vos chats.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Chargement des chats...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mes Chats et Invitations</h2>
                <div className="text-sm text-gray-600">
                    Connecté en tant que: <strong>{user.firstname} {user.lastname}</strong>
                </div>
            </div>

            <div className="chat-list">
                {chats.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Aucun chat disponible.</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div key={chat.id} className="chat-card">
                            <div className="chat-info">
                                <h3>{chat.channel}</h3>
                                <p>{chat.description}</p>
                            </div>
                            <div className="chat-actions">
                                <Link to={`/chat/${chat.id}`}>
                                    <button className="view">Voir</button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Accueil;