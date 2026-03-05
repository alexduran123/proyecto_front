import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Dashboard = () => {
    // Estado para guardar los datos que vienen del Backend
    const [data, setData] = useState({
        unidades: 0,
        alertas_pendientes: 0,
        mensajes_nuevos: 0,
        cobros_mes: 0
    });

    // Llamada a la API de Laravel al cargar la página
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/dashboard');
                // Accedemos a response.data.resumen según tu controlador de Laravel
                setData(response.data.resumen);
            } catch (error) {
                console.error("Error cargando datos del dashboard:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar />
            
            <main className="main-content">
                {/* Cabecera del Dashboard */}
                <header className="dashboard-header">
                    <div>
                        <h1>Panel de Administración</h1>
                        <p style={{ color: '#64748b' }}>Gestión de residentes y servicios</p>
                    </div>
                    <div className="user-info">
                        <div className="notification-bell">
                            <i className="fas fa-bell"></i>
                            {data.alertas_pendientes > 0 && <span className="dot"></span>}
                        </div>
                        <div className="avatar">AD</div>
                    </div>
                </header>

                {/* R01/R07: Grid de Estadísticas Reales */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon icon-blue">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="stat-info">
                            <p>Total Unidades</p>
                            <h3>{data.unidades}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon icon-orange">
                            <i className="fas fa-wallet"></i>
                        </div>
                        <div className="stat-info">
                            <p>Recaudación Mensual</p>
                            <h3>${data.cobros_mes.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon icon-red">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="stat-info">
                            <p>Alertas Activas</p>
                            <h3>{data.alertas_pendientes}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon icon-green">
                            <i className="fas fa-comments"></i>
                        </div>
                        <div className="stat-info">
                            <p>Nuevos Mensajes</p>
                            <h3>{data.mensajes_nuevos}</h3>
                        </div>
                    </div>
                </section>

                {/* R01: Sección de Actividad Reciente */}
                <div className="dashboard-content-grid">
                    <section className="recent-reports">
                        <div className="section-header">
                            <h2>Últimos Movimientos</h2>
                            <button className="btn-view-all">Ver todos</button>
                        </div>
                        
                        <div className="report-list">
                            <div className="report-item">
                                <div className="report-details">
                                    <strong>Pago de Mantenimiento</strong>
                                    <span>Unidad B-204 • Hace 15 min</span>
                                </div>
                                <span className="status-badge status-paid">Completado</span>
                            </div>
                            <div className="report-item">
                                <div className="report-details">
                                    <strong>Reporte de Fuga</strong>
                                    <span>Área Común • Hace 1 hora</span>
                                </div>
                                <span className="status-badge status-urgent">Urgente</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;