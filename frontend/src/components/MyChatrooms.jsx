import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Authentication";
import "./Chatrooms.css";

const MyChatrooms = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadMyChats = async () => {
            if (!user?.id) {
                console.log('❌ Pas d\'utilisateur pour charger les chats');
                setLoading(false);
                return;
            }

            try {
                console.log('🔄 Chargement de mes chats pour:', user.email);
                setLoading(true);
                setError('');

                const response = await axios.get(
                    `http://localhost:8080/api/chatroom/myChatrooms?id=${user.id}`
                );

                console.log('✅ Mes chats chargés:', response.data);
                setChats(response.data);
            } catch (err) {
                console.error('❌ Erreur chargement mes chats:', err);

                if (err.response?.status === 401) {
                    setError("Session expirée. Veuillez vous reconnecter.");
                } else if (err.response?.status === 403) {
                    setError("Accès non autorisé.");
                } else {
                    setError("Erreur lors du chargement des chats.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadMyChats();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce chat ?")) {
            return;
        }

        try {
            console.log('🗑️ Suppression du chat:', id);
            await axios.delete(`http://localhost:8080/api/chatroom/delete/${id}`);

            console.log('✅ Chat supprimé avec succès');
            setChats(prevChats => prevChats.filter(chat => chat.id !== id));
        } catch (err) {
            console.error('❌ Erreur suppression:', err);

            if (err.response?.status === 401) {
                alert("Session expirée. Veuillez vous reconnecter.");
            } else if (err.response?.status === 403) {
                alert("Vous n'avez pas les droits pour supprimer ce chat.");
            } else {
                alert("Échec de la suppression. Veuillez réessayer.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/editChatroom/${id}`);
    };

    // Gestion des états de chargement
    if (!user) {
        return (
            <div className="page-container">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Veuillez vous connecter pour voir vos chats.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <h2>Mes Chats</h2>
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Chargement de vos chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mes Chats</h2>
                <div className="text-sm text-gray-600">
                    Connecté en tant que: <strong>{user.firstname} {user.lastname}</strong>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="chat-list">
                {chats.length === 0 && !error ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">Vous n'avez créé aucun chat.</p>
                        <Link
                            to="/createChatroom"
                            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Créer votre premier chat
                        </Link>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div key={chat.id} className="chat-card">
                            <div className="chat-info">
                                <h3>{chat.channel}</h3>
                                <p>{chat.description}</p>
                                <div className="chat-meta">
                                    <small className="text-gray-500">
                                        Créé le {new Date(chat.date).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <Link to={`/chat/${chat.id}`}>
                                    <button className="view">Voir</button>
                                </Link>
                                <button
                                    className="edit"
                                    onClick={() => handleEdit(chat.id)}
                                >
                                    Modifier
                                </button>
                                <button
                                    className="delete"
                                    onClick={() => handleDelete(chat.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyChatrooms;