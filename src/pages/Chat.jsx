import React, { useEffect, useState } from 'react';
import echo from '../echo';
import axios from 'axios';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
    console.log("Intentando conectar al canal 'chat'...");

    const channel = echo.channel('chat');

    channel.listen('MessageSent', (e) => {
        console.log("¡Mensaje recibido desde el servidor!", e);
        setMessages((prev) => [...prev, e.message]);
    });

    // Esto te dirá en la consola (F12) si la conexión fue exitosa
    echo.connector.pusher.connection.bind('connected', () => {
        console.log('--- CONECTADO AL PUERTO 8080 ---');
    });

    return () => echo.leaveChannel('chat');
}, []);

    const sendMessage = async () => {
    if (!text.trim()) return;
    
    // 1. Lo agregamos a nuestra pantalla localmente
    setMessages((prev) => [...prev, text]); 

    try {
        await axios.post('http://localhost:8000/api/send-message', { message: text });
        setText('');
    } catch (error) {
        console.error("Error:", error);
    }
};

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#ff6600', marginBottom: '20px' }}>Módulo de Chat</h1>
            
            {/* Caja de Mensajes */}
            <div style={{ 
                height: '350px', border: '1px solid #e5e7eb', borderRadius: '12px',
                background: 'white', padding: '20px', overflowY: 'auto', marginBottom: '20px'
            }}>
                {messages.length === 0 && <p style={{color: '#9ca3af'}}>No hay mensajes en la comunidad...</p>}
                {messages.map((m, i) => (
                    <div key={i} style={{ 
                        background: '#fff7ed', padding: '10px', borderRadius: '8px', 
                        marginBottom: '10px', borderLeft: '4px solid #ff6600' 
                    }}>
                        <strong>Vecino:</strong> {m}
                    </div>
                ))}
            </div>

            {/* Input y Botón */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe un mensaje para el condominio..." 
                    style={{ flexGrow: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} 
                />
                <button 
                    onClick={sendMessage}
                    style={{ 
                        padding: '10px 25px', background: '#ff6600', color: 'white', 
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                    }}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}

export default Chat;