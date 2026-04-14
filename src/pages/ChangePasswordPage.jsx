import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Aprovechamos que ya usas framer-motion
import '../styles/ChangePassword.css'; // Asumimos que crearás este CSS

function ChangePasswordPage() {
    const navigate = useNavigate();
    
    // ESTADOS PARA EL FORMULARIO
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    
    // ESTADOS PARA FEEDBACK
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // FUNCIÓN PRINCIPAL (LA QUE PEDISTE)
    const handleChangePassword = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        setError('');
        setLoading(true);

        // Validación básica en frontend
        if (newPassword !== newPasswordConfirmation) {
            setError('La nueva contraseña y la confirmación no coinciden.');
            setLoading(false);
            return;
        }

        try {
            // Petición POST segura al backend
            const response = await axios.post('http://localhost:8000/api/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation
            }, {
                // Importante: Enviar el token en los headers
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });

            setSuccess(true);
            setLoading(false);

            // Mismo comportamiento que tu Logout animado
            setTimeout(() => {
                // Borramos el token local (el backend ya borró todos los tokens del usuario)
                localStorage.removeItem('token');
                localStorage.removeItem('user'); 
                alert(response.data.message); // Opcional: un alert o notificación
                navigate('/login');
                window.location.reload(); // Recargamos para limpiar estado de la App
            }, 1500);

        } catch (err) {
            setLoading(false);
            // Capturamos el error del backend (ej: "Contraseña actual mal")
            setError(err.response?.data?.message || "Error al actualizar la contraseña.");
        }
    };

    // Renderizado de la vista con animaciones de entrada
    return (
        <motion.div 
            className="change-password-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="change-password-card">
                <div className="card-header">
                    <i className="fas fa-shield-halved fa-2x mb-3" style={{ color: '#3b82f6' }}></i>
                    <h2>Seguridad de la Cuenta</h2>
                    <p className="text-muted">Cambia tu contraseña para cerrar sesión en todos los dispositivos.</p>
                </div>

                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label>Contraseña Actual</label>
                        <div className="input-with-icon">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)} 
                                required 
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nueva Contraseña (mínimo 8 caracteres)</label>
                        <div className="input-with-icon">
                            <i className="fas fa-key"></i>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)} 
                                required 
                                disabled={loading || success}
                                minLength={8}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <div className="input-with-icon">
                            <i className="fas fa-key"></i>
                            <input 
                                type="password" 
                                value={newPasswordConfirmation}
                                onChange={e => setNewPasswordConfirmation(e.target.value)} 
                                required 
                                disabled={loading || success}
                                minLength={8}
                            />
                        </div>
                    </div>

                    {error && <div className="alert alert-danger"><i className="fas fa-circle-exclamation mr-2"></i>{error}</div>}
                    {success && <div className="alert alert-success"><i className="fas fa-circle-check mr-2"></i>Contraseña actualizada. Redirigiendo...</div>}

                    <button 
                        type="submit" 
                        className="btn-submit" 
                        disabled={loading || success}
                    >
                        {loading ? (
                            <><i className="fas fa-circle-notch fa-spin mr-2"></i>Procesando...</>
                        ) : (
                            'Actualizar y Cerrar Sesiones Globales'
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

export default ChangePasswordPage;