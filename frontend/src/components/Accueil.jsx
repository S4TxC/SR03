import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";

const Accueil = () => {
    const { user } = useAuth();
    const [myChats, setMyChats] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                const [myChatsRes, invitedChatsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/chatroom/myChatrooms?id=${user.id}`),
                    axios.get(`http://localhost:8080/api/chatroom/invitedChatrooms?id=${user.id}`),
                ]);
                setMyChats(myChatsRes.data);
                setInvitations(invitedChatsRes.data);
            } catch {
                setError("Error while loading data.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    if (!user) {
        return (
            <CenteredMessage message="Please login to see your chats." />
        );
    }

    if (loading) {
        return <CenteredMessage message="Loading..." />;
    }

    if (error) {
        return <CenteredMessage message={error} error />;
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
                <ChatSection title="My Chats" chats={myChats} buttonColor="blue" emptyText="No chat available." />
                <ChatSection title="My Invitations" chats={invitations} buttonColor="purple" emptyText="No invitations." />
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
            className="flex justify-between items-center mb-8 bg-white bg-opacity-70 border-4 border-black p-6"
            style={{ borderRadius: '0' }}
        >
            <h2
                className="text-3xl font-bold text-black cursor-pointer hover:text-blue-600 transition"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
                onClick={() => navigate("/userMenu")}
            >
                Dashboard
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

const ChatSection = ({ title, chats, buttonColor, emptyText }) => (
    <div className="mb-10">
        <h3
            className={`text-xl font-bold mb-6 ${
                buttonColor === 'blue' ? 'text-white' : 'text-white'
            }`}
            style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
            {title}
        </h3>

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
                        className="text-gray-600 font-bold"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                        {emptyText}
                    </p>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chats.map((chat) => (
                    <ChatCard key={chat.id} chat={chat} buttonColor={buttonColor} />
                ))}
            </div>
        )}
    </div>
);

const ChatCard = ({ chat, buttonColor }) => (
    <div
        className="bg-white bg-opacity-80 border-4 border-black p-6 hover:bg-opacity-90 transition-all duration-200"
        style={{ borderRadius: '0' }}
    >
        <div className="flex items-start space-x-4 mb-4">
            <div
                className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 ${
                    buttonColor === 'blue' ? 'bg-blue-600' : 'bg-purple-600'
                }`}
                style={{ borderRadius: '0' }}
            >
                <span
                    className="text-white font-bold"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                >
                    {chat.channel.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex-1">
                <h4
                    className="text-lg font-bold text-black mb-2"
                    style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9em' }}
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
                className={`w-full py-3 px-4 font-bold border-2 border-black transition-all duration-200 hover:opacity-90 ${
                    buttonColor === 'blue'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
                style={{
                    borderRadius: '0',
                    fontFamily: "'Press Start 2P', cursive"
                }}
            >
                {buttonColor === "purple" ? "Join" : "Open"}
            </button>
        </Link>
    </div>
);

export default Accueil;