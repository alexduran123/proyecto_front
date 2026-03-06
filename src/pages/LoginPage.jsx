import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Intentando iniciar sesión con:", email);

        try {
            const response = await axios.post('http://localhost:8000/api/login', { 
                email, 
                password 
            });
            
            console.log("Respuesta del servidor:", response.data);

            if (response.data.access_token) {
                // 1. Guardamos el token (Esto ya lo tenías)
                localStorage.setItem('token', response.data.access_token);
                
                // 2. ¡ESTA ES LA CORRECCIÓN! Guardamos el objeto user que trae el role
                // Usamos JSON.stringify porque el localStorage solo guarda texto
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // 3. Redirigimos
                window.location.href = '/dashboard'; 
            }
        } catch (error) {
            console.error("Error completo:", error);
            alert("Error de conexión o credenciales. Revisa la consola.");
        }
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            height: '100vh', backgroundColor: '#f0f2f5', width: '100vw' 
        }}>
            <div style={{ 
                background: 'white', padding: '40px', borderRadius: '15px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
                textAlign: 'center'
            }}>
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
                    <button type="submit" style={buttonStyle}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

// Estilos
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
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
};

export default Login;