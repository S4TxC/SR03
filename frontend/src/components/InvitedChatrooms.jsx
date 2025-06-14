import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
            <CenteredMessage message="Please log in to see your invitations." />
        );
    }

    if (loading) {
        return <CenteredMessage message="Loading invitations..." />;
    }

    if (error) {
        return <CenteredMessage message={error} error={true} />;
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
                <ChatSection invitations={invitations} />
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
                    className={`w-16 h-16 ${error ? 'bg-red-600' : 'bg-purple-600'} border-2 border-black flex items-center justify-center mb-4 mx-auto`}
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
                className="text-3xl font-bold text-black cursor-pointer hover:text-purple-600 transition"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
                onClick={() => navigate("/userMenu")}
            >
                My Invitations
            </h2>

            <div
                className="bg-gray-800 border-2 border-black px-4 py-2"
                style={{ borderRadius: '0' }}
            >
                <span
                    className="text-sm text-white"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                >
                    Logged as: <strong className="text-purple-400">{user.firstname} {user.lastname}</strong>
                </span>
            </div>
        </div>
    );
};

const ChatSection = ({ invitations }) => (
    <div className="mb-10">
        {invitations.length === 0 ? (
            <div
                className="bg-white bg-opacity-70 border-4 border-black p-6"
                style={{ borderRadius: '0' }}
            >
                <div className="text-center">
                    <div
                        className="w-16 h-16 bg-purple-600 border-2 border-black flex items-center justify-center mb-4 mx-auto"
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
                        className="text-gray-600 font-bold"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                        No invitations.
                    </p>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {invitations.map((chat) => (
                    <InvitationCard key={chat.id} chat={chat} />
                ))}
            </div>
        )}
    </div>
);

const InvitationCard = ({ chat }) => (
    <div
        className="bg-white bg-opacity-80 border-4 border-black p-6 hover:bg-opacity-90 transition-all duration-200"
        style={{ borderRadius: '0' }}
    >
        <div className="flex items-start space-x-4 mb-4">
            <div
                className="w-12 h-12 bg-purple-600 border-2 border-black flex items-center justify-center flex-shrink-0"
                style={{ borderRadius: '0' }}
            >
                <span
                    className="text-white font-bold"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9em' }}
                >
                    {chat.channel.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex-1">
                <h4
                    className="text-xl font-bold text-black mb-2"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '1em' }}
                >
                    {chat.channel}
                </h4>
                <p
                    className="text-sm text-gray-600 mb-4"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                >
                    {chat.description}
                </p>
            </div>
        </div>

        <Link to={`/chat/${chat.id}`}>
            <button
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold border-2 border-black transition-all duration-200 hover:opacity-90"
                style={{
                    borderRadius: '0',
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.8em'
                }}
            >
                Join Chatroom
            </button>
        </Link>
    </div>
);

export default InvitedChatrooms;