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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-slate-600 font-medium">
                                Please login to see your chats.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                        <div className="border-b border-slate-200 pb-6 mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent text-center">
                                My chats
                            </h2>
                        </div>
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-slate-600 font-medium">Loading your chats...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-slate-200 pb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                            My Chats
                        </h2>
                        <div className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 font-medium">
                            Logged as: <span className="text-blue-700 font-semibold">{user.firstname} {user.lastname}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {chats.length === 0 && !error ? (
                            <div className="text-center py-16">
                                <p className="text-slate-500 text-lg font-medium mb-6">You do not have chats.</p>
                                <Link
                                    to="/createChatroom"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Create your first Chatroom
                                </Link>
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-blue-800 mb-2 group-hover:text-blue-900 transition-colors">
                                                {chat.channel}
                                            </h3>
                                            <p className="text-slate-600 mb-3 leading-relaxed">
                                                {chat.description}
                                            </p>
                                            <div className="flex items-center text-sm text-slate-500">
                                                Créé le {new Date(chat.date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 lg:flex-shrink-0">
                                            <Link to={`/chat/${chat.id}`}>
                                                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105">
                                                    View
                                                </button>
                                            </Link>

                                            <button
                                                className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                                onClick={() => handleEdit(chat.id)}
                                            >
                                                Modify
                                            </button>

                                            <button
                                                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                                onClick={() => handleDelete(chat.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyChatrooms;
