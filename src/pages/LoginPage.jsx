import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado para el botón
    const [errorMsg, setErrorMsg] = useState(null); // Estado para la alerta
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const response = await axios.post('http://localhost:8000/api/login', { 
                email, 
                password 
            });
            
            if (response.data.access_token) {
                // Guardamos token y usuario
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Pequeño delay para que la transición se vea fluida
                setTimeout(() => {
                    window.location.href = '/dashboard'; 
                }, 500);
            }
        } catch (error) {
            console.error("Error completo:", error);
            setErrorMsg("Credenciales incorrectas o error de servidor.");
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            height: '100vh', backgroundColor: '#f0f2f5', width: '100vw' 
        }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: 'white', padding: '40px', borderRadius: '15px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
                    textAlign: 'center'
                }}
            >
                <h1 style={{ color: '#ff6600', marginBottom: '10px' }}>CondoApp</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Inicia sesión para continuar</p>
                
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    {/* ALERTA DE ERROR ANIMADA */}
                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ color: '#e11d48', fontSize: '14px', marginBottom: '15px' }}
                            >
                                <i className="fas fa-circle-exclamation"></i> {errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* BOTÓN CON TRANSICIÓN */}
                    <motion.button 
                        type="submit" 
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        style={{
                            ...buttonStyle,
                            backgroundColor: loading ? '#ccc' : '#ff6600',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <i className="fas fa-spinner fa-spin"></i> Entrando...
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="label"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    Entrar
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

// Estilos (se mantienen igual)
const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
};

const buttonStyle = {
    width: '100%',
    padding: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    overflow: 'hidden'
};

export default Login;