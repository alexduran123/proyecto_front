import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState({
        unidades: 0,
        alertas_pendientes: 0,
        mensajes_nuevos: 0,
        cobros_mes: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Recuperamos el token del localStorage
                const token = localStorage.getItem('token');
                
                // 2. Enviamos el token en los headers
                const response = await axios.get('http://localhost:8000/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Verificamos si la estructura es la correcta antes de setear
                if (response.data && response.data.resumen) {
                    setData(response.data.resumen);
                }
            } catch (error) {
                console.error("Error cargando datos del dashboard:", error);
                // Si da 401, podrías redirigir al login
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar />
            
            <main className="main-content">
                <header className="dashboard-header">
                    <div>
                        <h1>Panel de Administración</h1>
                        <p style={{ color: '#64748b' }}>Gestión de residentes y servicios</p>
                    </div>
                    <div className="user-info">
                        <div className="notification-bell">
                            <i className="fas fa-bell"></i>
                            {/* Protección contra valores nulos */}
                            {(data?.alertas_pendientes > 0) && <span className="dot"></span>}
                        </div>
                        <div className="avatar">AD</div>
                    </div>
                </header>

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon icon-blue"><i className="fas fa-building"></i></div>
                        <div className="stat-info">
                            <p>Total Unidades</p>
                            <h3>{data?.unidades || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon icon-orange"><i className="fas fa-wallet"></i></div>
                        <div className="stat-info">
                            <p>Recaudación Mensual</p>
                            {/* .toLocaleString() puede fallar si data es undefined */}
                            <h3>${(data?.cobros_mes || 0).toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon icon-red"><i className="fas fa-exclamation-triangle"></i></div>
                        <div className="stat-info">
                            <p>Alertas Activas</p>
                            <h3>{data?.alertas_pendientes || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon icon-green"><i className="fas fa-comments"></i></div>
                        <div className="stat-info">
                            <p>Nuevos Mensajes</p>
                            <h3>{data?.mensajes_nuevos || 0}</h3>
                        </div>
                    </div>
                </section>
                
                {/* ... resto del código ... */}
            </main>
        </div>
    );
};

export default Dashboard;