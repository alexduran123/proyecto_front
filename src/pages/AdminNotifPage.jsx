import React, { useState } from 'react';
import axios from 'axios';

const AdminNotifPage = () => {
    const [tipo, setTipo] = useState('mensaje');
    const [mensaje, setMensaje] = useState('');
    const [idRef, setIdRef] = useState('');
    const [loading, setLoading] = useState(false);

    const enviarAlerta = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/send-notif', {
                type: tipo,
                message: mensaje,
                id_referencia: idRef || 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("¡Alerta enviada con éxito!");
            setMensaje('');
            setIdRef('');
        } catch (error) {
            alert("Error al enviar la notificación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '10px' }}>
                Centro de Emisión de Alertas
            </h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Selecciona el tipo de aviso y escribe el mensaje. Se notificará a todos en tiempo real.
            </p>

            <form onSubmit={enviarAlerta} style={cardStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>Categoría del Aviso</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
                        <option value="mensaje">Mensaje General</option>
                        <option value="multas">Aviso de Multa</option>
                        <option value="asambleas">Convocatoria Asamblea</option>
                        <option value="pagos">Recordatorio de Pago</option>
                    </select>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Mensaje de la Alerta</label>
                    <textarea 
                        placeholder="Escribe aquí el aviso importante..." 
                        value={mensaje} 
                        onChange={(e) => setMensaje(e.target.value)}
                        style={{ ...inputStyle, height: '120px', resize: 'none' }}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? "Enviando..." : "Lanzar Alerta Global"}
                </button>
            </form>
        </div>
    );
};

// Estilos internos para que se vea como en tu imagen
const cardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
};

const groupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' };
const inputStyle = { 
    width: '100%', padding: '12px', borderRadius: '8px', 
    border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' 
};
const buttonStyle = { 
    width: '100%', padding: '15px', backgroundColor: '#ff6600', 
    color: 'white', border: 'none', borderRadius: '8px', 
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' 
};

export default AdminNotifPage;