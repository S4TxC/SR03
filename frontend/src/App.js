import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080/salon?room=1?user=TEST');

    websocket.onopen = () => {
      console.log('WebSocket is connected');
    };

    websocket.onmessage = (evt) => {
      const message = (evt.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    websocket.onclose = () => {
      console.log('WebSocket is closed');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({
        user: 'Cédric',
        message: message,
      }));
      setMessage('');
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };


  return (
      <div className="App">
        <header className="App-header">

          <h1>
            Exemple SR03 - Cédric Martinet
          </h1>
          {messages.map((message, index) => <p key={index}>{message}</p>)}
          <input type="text" value={message}
                 onChange={handleInputChange}/>
          <br/>
          <button onClick={sendMessage}>
            Envoyer le message
          </button>

        </header>
      </div>
  );
}

export default App;
