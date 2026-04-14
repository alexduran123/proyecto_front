import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ChangePassword.css'; // Reutilizamos estilos base

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const [step, setStep] = useState(1); // 1: Pedir correo, 2: Resetear
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Paso 1: Enviar el código al correo
    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post('http://localhost:8000/api/forgot-password', { email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Error al enviar el código");
        } finally {
            setLoading(false);
        }
    };

    // Paso 2: Validar código y cambiar clave
    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== passwordConfirmation) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/reset-password', {
                email,
                code,
                password,
                password_confirmation: passwordConfirmation
            });
            alert("¡Contraseña actualizada con éxito!");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Código inválido o expirado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <motion.div 
                className="change-password-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="card-header">
                    <i className="fas fa-key fa-2x mb-3" style={{ color: '#ff6600' }}></i>
                    <h2>{step === 1 ? 'Recuperar Clave' : 'Restablecer Clave'}</h2>
                    <p className="text-muted">
                        {step === 1 
                            ? 'Ingresa tu correo para recibir un código de 6 dígitos.' 
                            : `Enviamos un código a ${email}`}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form 
                            key="step1"
                            onSubmit={handleSendCode}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-envelope"></i>
                                    <input 
                                        type="email" 
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <button className="btn-submit" style={{ backgroundColor: '#ff6600' }} disabled={loading}>
                                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Enviar Código a Gmail'}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form 
                            key="step2"
                            onSubmit={handleReset}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="form-group">
                                <label>Código de Verificación</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-hashtag"></i>
                                    <input 
                                        type="text" 
                                        placeholder="000000"
                                        maxLength="6"
                                        value={code}
                                        onChange={e => setCode(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nueva Contraseña</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-lock"></i>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-check-double"></i>
                                    <input 
                                        type="password" 
                                        value={passwordConfirmation}
                                        onChange={e => setPasswordConfirmation(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <button className="btn-submit" style={{ backgroundColor: '#ff6600' }} disabled={loading}>
                                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Restablecer Contraseña'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: '#ff6600', textDecoration: 'none', fontSize: '14px' }}>
                        <i className="fas fa-arrow-left"></i> Volver al Inicio de Sesión
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    width: '100vw'
};

export default ForgotPassword;