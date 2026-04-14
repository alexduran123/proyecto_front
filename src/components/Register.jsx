import { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        id_persona: '',
        email: '',
        pass: '',
        pass_confirmation: '' // Laravel pide esto para el 'confirmed'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Requisito Sanctum: Obtener cookie CSRF
            await axios.get('http://localhost:8000/sanctum/csrf-cookie');

            const res = await axios.post('http://localhost:8000/api/register', formData);
            alert(res.data.message);
        } catch (error) {
            console.error(error.response.data);
            alert("Error al registrar: " + JSON.stringify(error.response.data));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
            <h2>Registro de Usuario</h2>
            <input type="number" placeholder="ID Persona" onChange={e => setFormData({...formData, id_persona: e.target.value})} className="border p-2 mb-2 w-full" />
            <input type="email" placeholder="Correo Gmail" onChange={e => setFormData({...formData, email: e.target.value})} className="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Contraseña" onChange={e => setFormData({...formData, pass: e.target.value})} className="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Confirmar Contraseña" onChange={e => setFormData({...formData, pass_confirmation: e.target.value})} className="border p-2 mb-2 w-full" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrar y Enviar Correo</button>
        </form>
    );
};

export default Register;