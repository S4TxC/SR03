import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Authentication";

const MyChatrooms = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadMyChats = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const response = await axios.get(
                    `http://localhost:8080/api/chatroom/myChatrooms?id=${user.id}`
                );

                setChats(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Session expired. Please try again.");
                } else if (err.response?.status === 403) {
                    setError("Access denied.");
                } else {
                    setError("Error while loading Chatroom");
                }
            } finally {
                setLoading(false);
            }
        };

        loadMyChats();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this chatroom ?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/chatroom/delete/${id}`);
            setChats(prevChats => prevChats.filter(chat => chat.id !== id));
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Session expired. Please try again.");
            } else if (err.response?.status === 403) {
                alert("You do not have permission to delete this chat.");
            } else {
                alert("Deletion failed. Please try again.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/editChatroom/${id}`);
    };

    if (!user) {
        return (
            <CenteredMessage message="Please login to see your chats." />
        );
    }

    if (loading) {
        return <CenteredMessage message="Loading your chats..." />;
    }

    return (
        <div
            className="min-h-screen py-8 px-4"
            style={{
                backgroundImage: "url('/images/BackgroundDashboard.gif')",
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }}
        >
            <div className="max-w-5xl mx-auto">
                <Header user={user} />

                {error && (
                    <div
                        className="bg-red-600 bg-opacity-80 border-4 border-black p-6 mb-8"
                        style={{ borderRadius: '0' }}
                    >
                        <div className="flex items-center">
                            <div
                                className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center mr-4"
                                style={{ borderRadius: '0' }}
                            >
                                <span
                                    className="text-red-600 font-bold"
                                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                                >
                                    !
                                </span>
                            </div>
                            <p
                                className="text-white font-bold"
                                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                            >
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                <ChatSection chats={chats} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

const CenteredMessage = ({ message, error = false }) => (
    <div
        className="flex justify-center items-center h-screen"
        style={{
            backgroundImage: "url('/images/BackgroundDashboard.gif')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }}
    >
        <div
            className="bg-white bg-opacity-80 p-8 border-4 border-black"
            style={{ borderRadius: '0' }}
        >
            <div className="text-center">
                <div
                    className={`w-16 h-16 ${error ? 'bg-red-600' : 'bg-blue-600'} border-2 border-black flex items-center justify-center mb-4 mx-auto`}
                    style={{ borderRadius: '0' }}
                >
                    <span
                        className="text-white font-bold text-2xl"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                        {error ? '!' : '?'}
                    </span>
                </div>
                <p
                    className={`text-lg font-bold mb-2 ${error ? 'text-red-600' : 'text-gray-800'}`}
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                    {message}
                </p>
            </div>
        </div>
    </div>
);

const Header = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 bg-white bg-opacity-70 border-4 border-black p-6"
            style={{ borderRadius: '0' }}
        >
            <h2
                className="text-3xl font-bold text-black cursor-pointer hover:text-blue-600 transition"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
                onClick={() => navigate("/userMenu")}
            >
                My Chats
            </h2>

            <div
                className="bg-gray-800 border-2 border-black px-4 py-2"
                style={{ borderRadius: '0' }}
            >
                <span
                    className="text-sm text-white"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                >
                    Logged as: <strong className="text-blue-400">{user.firstname} {user.lastname}</strong>
                </span>
            </div>
        </div>
    );
};


const ChatSection = ({ chats, onEdit, onDelete }) => (
    <div className="mb-10">
        {chats.length === 0 ? (
            <div
                className="bg-white bg-opacity-70 border-4 border-black p-6"
                style={{ borderRadius: '0' }}
            >
                <div className="text-center">
                    <div
                        className="w-16 h-16 bg-gray-600 border-2 border-black flex items-center justify-center mb-4 mx-auto"
                        style={{ borderRadius: '0' }}
                    >
                        <span
                            className="text-white font-bold text-2xl"
                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                        >
                            ?
                        </span>
                    </div>
                    <p
                        className="text-gray-600 font-bold mb-6"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                        You do not have chats.
                    </p>
                    <Link to="/createChatroom">
                        <button
                            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black transition-all duration-200 hover:opacity-90"
                            style={{
                                borderRadius: '0',
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.8em'
                            }}
                        >
                            Create your first Chatroom
                        </button>
                    </Link>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
                {chats.map((chat) => (
                    <ChatCard key={chat.id} chat={chat} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>
        )}
    </div>
);

const ChatCard = ({ chat, onEdit, onDelete }) => (
    <div
        className="bg-white bg-opacity-80 border-4 border-black p-6 hover:bg-opacity-90 transition-all duration-200"
        style={{ borderRadius: '0' }}
    >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-4 flex-1">
                <div
                    className="w-12 h-12 bg-blue-600 border-2 border-black flex items-center justify-center flex-shrink-0"
                    style={{ borderRadius: '0' }}
                >
                    <span
                        className="text-white font-bold"
                        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9em' }}
                    >
                        {chat.channel.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4
                        className="text-xl font-bold text-black mb-2"
                        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1em' }}
                    >
                        {chat.channel}
                    </h4>
                    <p
                        className="text-sm text-gray-600 mb-3"
                        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                    >
                        {chat.description}
                    </p>
                    <div
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6em' }}
                    >
                        Créé le {new Date(chat.date).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 lg:flex-shrink-0">
                <Link to={`/chat/${chat.id}`}>
                    <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black transition-all duration-200 hover:opacity-90"
                        style={{
                            borderRadius: '0',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.7em'
                        }}
                    >
                        View
                    </button>
                </Link>

                <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold border-2 border-black transition-all duration-200 hover:opacity-90"
                    style={{
                        borderRadius: '0',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7em'
                    }}
                    onClick={() => onEdit(chat.id)}
                >
                    Modify
                </button>

                <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-black transition-all duration-200 hover:opacity-90"
                    style={{
                        borderRadius: '0',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.7em'
                    }}
                    onClick={() => onDelete(chat.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default MyChatrooms;