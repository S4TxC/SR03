import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";

const InvitedChatrooms = () => {
    const { user } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInvitations = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:8080/api/chatroom/invitedChatrooms?id=${user.id}`
                );
                setInvitations(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Session expired");
                } else {
                    setError("Error while logging in.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadInvitations();
    }, [user]);

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-700">
                    Please log in to see your invitations.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-500">Loading invitations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">My invitations</h2>
                    <div className="text-sm text-gray-500">
                        Logged as: <strong>{user.firstname} {user.lastname}</strong>
                    </div>
                </div>

                {invitations.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p>No invitations.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {invitations.map((chat) => (
                            <div
                                key={chat.id}
                                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition duration-200"
                            >
                                <h3 className="text-xl font-bold text-blue-700">{chat.channel}</h3>
                                <p className="text-gray-600 mt-2 mb-4">{chat.description}</p>
                                <Link to={`/chat/${chat.id}`}>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                        View the Chatroom
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitedChatrooms;
