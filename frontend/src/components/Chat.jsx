import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import {useNavigate, useParams} from "react-router-dom";
import { useAuth } from "./Authentication";
import axios from "axios";

const getUserStatus = (username) => {
    return true;
};

const Chat = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef();
    const messagesEndRef = useRef(null);
    const [connectedUsers, setConnectedUsers] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user?.id) return;
        const username = user.firstname || 'Guest';
        // Tester si l'utilisateur est membre du chat
        axios.get(`http://localhost:8080/api/chatroom/canAccess`, {
            params: {
                chatroomId: id,
                userId: user.id
            }
        })
            .then((res) => {
                if (!res.data.access) {
                    setTimeout(() => {
                        window.location.href = "/userMenu";
                    }, 5);
                }
            })

        const websocket = new WebSocket(
            `ws://localhost:8080/ws/chat?room=${id}&user=${username}`
        );

        websocket.onmessage = (evt) => {
            try {
                const msg = JSON.parse(evt.data);
                console.log('Message reçu avec image:', msg);

                // Gestion des utilisateurs connectés
                if (msg.connectedUsers) {
                    setConnectedUsers(msg.connectedUsers);
                }

                setMessages((prev) => [...prev, msg]);
            } catch (e) {
                console.error("Erreur lors de la désérialisation du message:", e);
            }
        };

        setWs(websocket);
        return () => websocket.close();
    }, [id, user]);

    const sendMessage = async () => {
        if (!user?.id || !ws) return;

        let imageUrl = null;
        if (file) {
            const form = new FormData();
            form.append('file', file);
            const res = await axios.post(
                'http://localhost:8080/api/uploads/images',
                form,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );
            imageUrl = res.data;
        }

        const payload = {
            user: user.firstname || 'Guest',
            message: message.trim(),
            imageUrl,
        };
        console.log('Payload envoyé:', payload);
        ws.send(JSON.stringify(payload));
        setMessage('');
        setFile(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
        }
    };

    if (!user) {
        return (
            <div
                className="min-h-screen"
                style={{
                    backgroundImage: "url('/images/BackgroundChat.gif')",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            >
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div
                        className="bg-white bg-opacity-20 p-8 border-4 border-black"
                        style={{ borderRadius: '0' }}
                    >
                        <div className="text-center">
                            <div
                                className="w-16 h-16 bg-red-600 border-2 border-black flex items-center justify-center mb-4 mx-auto"
                                style={{ borderRadius: '0' }}
                            >
                                <span
                                    className="text-white font-bold text-2xl"
                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                >
                                    !
                                </span>
                            </div>
                            <p
                                className="text-lg font-bold text-gray-800 mb-2"
                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                            >
                                Session expired
                            </p>
                            <p
                                className="text-gray-600"
                                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                            >
                                Please sign in again to access chat.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: "url('/images/BackgroundChat.gif')",
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }}
        >
            <Header />
            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-7xl">
                    <div className="flex w-full">
                        <div className="flex-1 mr-4">
                            <div className="bg-white bg-opacity-20 border-4 border-black overflow-hidden"
                                 style={{ borderRadius: '0' }}
                            >
                                <div className="bg-blue-600 px-6 py-4 border-b-4 border-black">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 border-2 border-black ${
                                                ws ? 'bg-green-400' : 'bg-red-400'
                                            }`}
                                                 style={{ borderRadius: '0' }}
                                            ></div>
                                            <h2
                                                className="text-xl font-bold text-white"
                                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                                            >
                                                Chat
                                            </h2>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2 text-white"
                                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                                        >
                                            <span>{ws ? 'Online' : 'Offline'}</span>
                                        </div>
                                    </div>
                                    <div
                                        className="mt-2 text-white"
                                        style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                                    >
                                        Logged as: <strong>{user.firstname} {user.lastname}</strong>
                                    </div>
                                </div>
                                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-100 bg-opacity-20">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <div
                                                className="w-16 h-16 bg-blue-600 border-2 border-black flex items-center justify-center mb-4"
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
                                                className="text-lg font-bold"
                                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                                            >
                                                No message
                                            </p>
                                            <p
                                                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}
                                            >
                                                Start discussing!
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            // Gestion des anciens messages (chaînes de caractères)
                                            if (typeof msg === 'string') {
                                                const colonIndex = msg.indexOf(' : ');
                                                let messageUser = 'Unknown';
                                                let messageContent = msg;

                                                if (colonIndex !== -1) {
                                                    messageUser = msg.substring(0, colonIndex);
                                                    messageContent = msg.substring(colonIndex + 3);
                                                }

                                                const isCurrentUser = messageUser === (user.firstname || 'Guest');

                                                if (messageContent.includes('has just connected!') ||
                                                    messageContent.includes('disconnected')) {
                                                    return (
                                                        <div key={idx} className="flex justify-center mb-2">
                                                            <div
                                                                className="bg-gray-400 px-3 py-1 border-2 border-black"
                                                                style={{ borderRadius: '0' }}
                                                            >
                                                                <p
                                                                    className="text-xs text-white text-center font-bold"
                                                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                                >
                                                                    {msg}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                                                        {!isCurrentUser && (
                                                            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                                <div className="flex-shrink-0">
                                                                    <div
                                                                        className="w-8 h-8 bg-gray-600 border-2 border-black flex items-center justify-center text-white font-bold"
                                                                        style={{
                                                                            borderRadius: '0',
                                                                            fontFamily: "'Press Start 2P', cursive",
                                                                            fontSize: '0.6em'
                                                                        }}
                                                                    >
                                                                        {messageUser.charAt(0).toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center mb-1">
                                                                        <span
                                                                            className="text-xs font-bold text-gray-700"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                                        >
                                                                            {messageUser}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="bg-white border-2 border-black px-4 py-3"
                                                                        style={{ borderRadius: '0' }}
                                                                    >
                                                                        <p
                                                                            className="text-sm leading-relaxed text-gray-800"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                                                                        >
                                                                            {messageContent}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isCurrentUser && (
                                                            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center justify-end mb-1">
                                                                        <span
                                                                            className="text-xs font-bold text-blue-600"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                                        >
                                                                            You
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="bg-blue-600 border-2 border-black px-4 py-3 text-white"
                                                                        style={{ borderRadius: '0' }}
                                                                    >
                                                                        <p
                                                                            className="text-sm leading-relaxed"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                                                                        >
                                                                            {messageContent}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    {user.avatarUrl ? (
                                                                        <img
                                                                            src={`http://localhost:8080${user.avatarUrl}`}
                                                                            alt="Votre avatar"
                                                                            className="w-8 h-8 object-cover border-2 border-black"
                                                                            style={{ borderRadius: '0', imageRendering: 'pixelated' }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="w-8 h-8 bg-blue-600 border-2 border-black flex items-center justify-center text-white font-bold"
                                                                            style={{
                                                                                borderRadius: '0',
                                                                                fontFamily: "'Press Start 2P', cursive",
                                                                                fontSize: '0.6em'
                                                                            }}
                                                                        >
                                                                            {(user.firstname || 'Guest').charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            else {
                                                const isCurrentUser = msg.user === (user.firstname || 'Guest');

                                                if (msg.message && (msg.message.includes('has just connected!') ||
                                                    msg.message.includes('disconnected'))) {
                                                    return (
                                                        <div key={idx} className="flex justify-center mb-2">
                                                            <div
                                                                className="bg-gray-400 px-3 py-1 border-2 border-black"
                                                                style={{ borderRadius: '0' }}
                                                            >
                                                                <p
                                                                    className="text-xs text-white text-center font-bold"
                                                                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                                >
                                                                    {msg.user} : {msg.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                                                        {!isCurrentUser && (
                                                            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                                <div className="flex-shrink-0">
                                                                    <div
                                                                        className="w-8 h-8 bg-gray-600 border-2 border-black flex items-center justify-center text-white font-bold"
                                                                        style={{
                                                                            borderRadius: '0',
                                                                            fontFamily: "'Press Start 2P', cursive",
                                                                            fontSize: '0.6em'
                                                                        }}
                                                                    >
                                                                        {msg.user.charAt(0).toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center mb-1">
                                                                        <span
                                                                            className="text-xs font-bold text-gray-700"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                                        >
                                                                            {msg.user}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="bg-white border-2 border-black px-4 py-3"
                                                                        style={{ borderRadius: '0' }}
                                                                    >
                                                                        <p
                                                                            className="text-sm leading-relaxed text-gray-800"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                                                                        >
                                                                            {msg.message}
                                                                        </p>
                                                                        {msg.imageUrl && (
                                                                            <img
                                                                                src={`http://localhost:8080${msg.imageUrl}`}
                                                                                alt="sent-img"
                                                                                className="mt-2 max-h-64 object-cover border-2 border-black"
                                                                                style={{ borderRadius: '0', imageRendering: 'pixelated' }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isCurrentUser && (
                                                            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center justify-end mb-1">
                                                                        <span
                                                                            className="text-xs font-bold text-blue-600"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                                                                        >
                                                                            You
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="bg-blue-600 border-2 border-black px-4 py-3 text-white"
                                                                        style={{ borderRadius: '0' }}
                                                                    >
                                                                        <p
                                                                            className="text-sm leading-relaxed"
                                                                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                                                                        >
                                                                            {msg.message}
                                                                        </p>
                                                                        {msg.imageUrl && (
                                                                            <img
                                                                                src={`http://localhost:8080${msg.imageUrl}`}
                                                                                alt="sent-img"
                                                                                className="mt-2 max-h-64 object-cover border-2 border-black"
                                                                                style={{ borderRadius: '0', imageRendering: 'pixelated' }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    {user.avatarUrl ? (
                                                                        <img
                                                                            src={`http://localhost:8080${user.avatarUrl}`}
                                                                            alt="Votre avatar"
                                                                            className="w-8 h-8 object-cover border-2 border-black"
                                                                            style={{ borderRadius: '0', imageRendering: 'pixelated' }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="w-8 h-8 bg-blue-600 border-2 border-black flex items-center justify-center text-white font-bold"
                                                                            style={{
                                                                                borderRadius: '0',
                                                                                fontFamily: "'Press Start 2P', cursive",
                                                                                fontSize: '0.6em'
                                                                            }}
                                                                        >
                                                                            {(user.firstname || 'Guest').charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        })
                                    )}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div
                                                className="bg-gray-300 px-4 py-3 border-2 border-black"
                                                style={{ borderRadius: '0' }}
                                            >
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-600 animate-bounce" style={{ borderRadius: '0' }}></div>
                                                    <div className="w-2 h-2 bg-gray-600 animate-bounce" style={{ borderRadius: '0', animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-600 animate-bounce" style={{ borderRadius: '0', animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-4 bg-white border-t-4 border-black">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2.5 border-2 border-black cursor-pointer absolute right-16 top-1/2 transform -translate-y-1/2"
                                                style={{
                                                    borderRadius: '0',
                                                    fontFamily: "'Press Start 2P', cursive",
                                                    fontSize: '0.7em'
                                                }}
                                            >
                                                Upload
                                            </button>

                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                disabled={!ws || !user}
                                                className="w-full px-4 py-3 bg-white border-2 border-black focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                style={{
                                                    borderRadius: '0',
                                                    fontFamily: "'Press Start 2P', cursive",
                                                    fontSize: '0.8em'
                                                }}
                                                placeholder={ws && user ? "Enter your message..." : "Login..."}
                                            />
                                        </div>
                                        <button
                                            onClick={sendMessage}
                                            disabled={!message.trim() && !file || !ws || !user}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold border-2 border-black disabled:cursor-not-allowed"
                                            style={{
                                                borderRadius: '0',
                                                fontFamily: "'Press Start 2P', cursive"
                                            }}
                                        >
                                            Send
                                        </button>
                                    </div>
                                    {file && (
                                        <div
                                            className="mt-2 text-sm text-gray-600"
                                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                                        >
                                            File: {file.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <SideBar
                            connectedUsers={connectedUsers}
                            currentUser={user}
                            getUserStatus={getUserStatus}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;