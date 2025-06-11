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
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <Header user={user} />
                <ChatSection title="My Chats" chats={myChats} buttonColor="blue" emptyText="No chat available." />
                <ChatSection title="My Invitations" chats={invitations} buttonColor="purple" emptyText="No invitations." />
            </div>
        </div>
    );
};

const CenteredMessage = ({ message, error = false }) => (
    <div className="flex justify-center items-center h-screen">
        <p className={`text-lg ${error ? "text-red-600" : ""}`}>{message}</p>
    </div>
);

const Header = ({ user }) => (
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <span className="text-sm text-gray-600">
            Logged as: <strong>{user.firstname} {user.lastname}</strong>
        </span>
    </div>
);

const ChatSection = ({ title, chats, buttonColor, emptyText }) => (
    <div className="mb-10">
        <h3 className={`text-xl font-bold mb-4 text-${buttonColor}-700`}>{title}</h3>
        {chats.length === 0 ? (
            <p className="text-gray-500">{emptyText}</p>
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
    <div className="bg-white p-5 rounded-lg shadow">
        <h4 className="text-lg font-semibold text-gray-800">{chat.channel}</h4>
        <p className="text-sm text-gray-600 mb-4">{chat.description}</p>
        <Link to={`/chat/${chat.id}`}>
            <button className={`px-4 py-2 bg-${buttonColor}-600 text-white rounded hover:bg-${buttonColor}-700`}>
                {buttonColor === "purple" ? "Join" : "Open"}
            </button>
        </Link>
    </div>
);

export default Accueil;
