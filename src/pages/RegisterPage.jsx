import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post('http://localhost:8000/api/register', {
                id_persona: 1, 
                name: name,
                email: email,
                pass: password, 
                rol: 'residente'
            });

            setMessage({ 
                type: 'success', 
                text: '¡Registro exitoso! Revisa tu correo de Outlook para verificar tu cuenta.' 
            });
            
            setTimeout(() => navigate('/login'), 4000);

        } catch (error) {
            const serverResponse = error.response?.data;
            let errorText = 'Error al registrar.';

            if (serverResponse?.errors?.email) {
                errorText = 'Este correo ya está registrado. Intenta con otro o inicia sesión.';
            } else if (serverResponse?.errors) {
                errorText = Object.values(serverResponse.errors).flat().join(', ');
            }

            setMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
                <h1 style={{ color: '#ff6600', marginBottom: '10px' }}>CondoApp</h1>
                <p style={{ color: '#666', marginBottom: '25px' }}>Crea tu cuenta nueva</p>

                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
                    <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                    <input type="password" placeholder="Contraseña (mínimo 8 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />

                    <AnimatePresence>
                        {message.text && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                                style={{ 
                                    color: message.type === 'error' ? '#e11d48' : '#10b981', 
                                    fontSize: '14px', marginBottom: '15px',
                                    backgroundColor: message.type === 'error' ? '#fff1f2' : '#f0fdf4',
                                    padding: '10px', borderRadius: '5px'
                                }}>
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" disabled={loading} 
                        style={{ ...buttonStyle, backgroundColor: loading ? '#ccc' : '#ff6600', cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Procesando...' : 'Registrarse'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#ff6600', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</Link>
                </p>
            </motion.div>
        </div>
    );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', width: '100vw' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold' };

export default RegisterPage;