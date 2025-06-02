import { useEffect, useState } from "react";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8080/salon?room=1&user=TEST');

        websocket.onopen = () => console.log('WebSocket is connected');

        websocket.onmessage = (evt) => {
            const message = evt.data;
            setMessages(prev => [...prev, message]);
        };

        websocket.onclose = () => console.log('WebSocket is closed');

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws) {
            ws.send(JSON.stringify({ user: 'Cédric', message }));
            setMessage('');
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Interface chat</h1>
                {messages.map((msg, idx) => <p key={idx}>{msg}</p>)}
                <input type="text" value={message} onChange={handleInputChange} />
                <br />
                <button onClick={sendMessage}>Envoyer</button>
            </header>
        </div>
    );
};

export default Chat;
