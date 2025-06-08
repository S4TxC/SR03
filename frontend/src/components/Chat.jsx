import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";

const Chat = () => {
    const { id } = useParams();
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const websocket = new WebSocket(`ws://localhost:8080/ws/chat?room=${id}&user=${user.name}`);
        websocket.onopen = () => console.log('WebSocket is connected');
        websocket.onmessage = (evt) => setMessages(prev => [...prev, evt.data]);
        websocket.onclose = () => console.log('WebSocket is closed');
        setWs(websocket);
        return () => websocket.close();
    }, []);

    const sendMessage = () => {
        if (ws && message.trim() !== '') {
            ws.send(JSON.stringify({ user: user.name, message }));
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Chat Interface</h1>

                <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded p-3 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <p key={idx} className="text-sm text-gray-700 mb-2">
                            {msg}
                        </p>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
