import { useEffect, useState } from 'react';
import Header from './Header';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const username = storedUser ? JSON.parse(storedUser).firstname : 'Guest';

        const websocket = new WebSocket(`ws://localhost:8080/ws/chat?room=1&user=${username}`);
        websocket.onopen = () => console.log('WebSocket is connected');
        websocket.onmessage = (evt) => setMessages(prev => [...prev, evt.data]);
        websocket.onclose = () => console.log('WebSocket is closed');
        setWs(websocket);
        return () => websocket.close();
    }, []);

    const sendMessage = () => {
        if (ws && message.trim() !== '') {
            ws.send(JSON.stringify({ user: user ? user.firstname : 'Guest', message }));
            setMessage('');
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Header />

            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-4xl">
                    {/* Chat Container */}
                    <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                                    <h2 className="text-xl font-semibold text-white">
                                        Chat
                                    </h2>
                                </div>
                                <div className="flex items-center space-x-2 text-blue-100">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                    </svg>
                                    <span className="text-sm">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">No message</p>
                                    <p className="text-sm">Start discussing !</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const currentUserName = user ? user.firstname : 'Guest';

                                    // Extraire le nom d'utilisateur et le message
                                    const colonIndex = msg.indexOf(' : ');
                                    let messageUser = 'Unknown';
                                    let messageContent = msg;

                                    if (colonIndex !== -1) {
                                        messageUser = msg.substring(0, colonIndex);
                                        messageContent = msg.substring(colonIndex + 3);
                                    }

                                    const isCurrentUser = messageUser === currentUserName;

                                    // Ignorer les messages de connexion/déconnexion
                                    if (messageContent.includes('vient de se connecter') ||
                                        messageContent.includes('vient de se déconnecter')) {
                                        return (
                                            <div key={idx} className="flex justify-center mb-2">
                                                <div className="bg-gray-100 px-3 py-1 rounded-full">
                                                    <p className="text-xs text-gray-500 text-center">{msg}</p>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                                            {/* Messages des autres utilisateurs - À gauche */}
                                            {!isCurrentUser && (
                                                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold">
                                                            {messageUser.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center mb-1">
                                                            <span className="text-xs font-medium text-gray-500">
                                                                {messageUser}
                                                            </span>
                                                        </div>
                                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-md shadow-md">
                                                            <p className="text-sm leading-relaxed text-gray-800">{messageContent}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Messages de l'utilisateur actuel - À droite */}
                                            {isCurrentUser && (
                                                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center justify-end mb-1">
                                                            <span className="text-xs font-medium text-blue-500">
                                                                You
                                                            </span>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-3 rounded-2xl rounded-tr-md shadow-md text-white">
                                                            <p className="text-sm leading-relaxed">{messageContent}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {user && user.avatarUrl ? (
                                                            <img
                                                                src={`http://localhost:8080${user.avatarUrl}`}
                                                                alt="Votre avatar"
                                                                className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                                {currentUserName.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 px-4 py-3 rounded-2xl border border-gray-200">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-200/50">
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="Enter your message..."
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:cursor-not-allowed"
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;