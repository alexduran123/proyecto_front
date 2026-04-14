import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const response = await axios.post('http://localhost:8000/api/login', { 
                email, 
                pass: password // Ajustado a 'pass' según tu controlador
            });
            
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                setTimeout(() => {
                    window.location.href = '/chat';
                }, 500);
            }
        } catch (error) {
            console.error("Error completo:", error);
            const msg = error.response?.status === 403 
                ? "Debes verificar tu correo electrónico primero." 
                : "Credenciales incorrectas o error de servidor.";
            setErrorMsg(msg);
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

                    <motion.button 
                        type="submit" 
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        style={{
                            ...buttonStyle,
                            backgroundColor: loading ? '#ccc' : '#ff6600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '15px'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <i className="fas fa-spinner fa-spin"></i> Entrando...
                                </motion.div>
                            ) : (
                                <motion.div key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Entrar
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </form>

                {/* --- OPCIÓN RECUPERAR CONTRASEÑA --- */}
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/forgot-password" style={{ color: '#ff6600', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {/* --- SECCIÓN DE REGISTRO --- */}
                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
                
                <p style={{ color: '#666', fontSize: '14px' }}>
                    ¿No tienes una cuenta todavía?
                </p>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#f8f9fa' }}
                        style={{
                            ...buttonStyle,
                            backgroundColor: 'transparent',
                            color: '#ff6600',
                            border: '2px solid #ff6600',
                            marginTop: '10px',
                            fontSize: '16px'
                        }}
                    >
                        Crear cuenta nueva
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}

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
    overflow: 'hidden',
    transition: 'background-color 0.3s'
};

export default Login;