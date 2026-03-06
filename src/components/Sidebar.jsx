import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Importamos animaciones
import echo from '../echo';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  
  // ESTADOS
  const [notifications, setNotifications] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Estado para la transición de salida

  // 1. RECUPERAMOS EL USUARIO DE FORMA SEGURA
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // AJUSTE CLAVE: Tu AuthController envía "role": "admin"
  const isAdmin = user?.role === 'admin'; 

  // ESCUCHADOR DE WEBSOCKETS (REVERB)
  useEffect(() => {
    const channel = echo.channel('condo-notifications');
    
    channel.listen('.notificacion.nueva', (e) => {
        console.log("¡LLEGÓ LA NOTIFICACIÓN!", e.data);
        setNotifications(prev => [e.data, ...prev]);
    });

    return () => echo.leaveChannel('condo-notifications');
  }, []);

  // Lógica de Logout con retardo para mostrar la animación
  const handleLogout = () => {
    setIsLoggingOut(true); 
    
    // Simulamos un breve tiempo de espera (800ms) para que se aprecie la animación
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      navigate('/login');
      window.location.reload();
    }, 800);
  };

  const handleNotifClick = (type, id) => {
    setShowDropdown(false);
    setNotifications(prev => prev.filter(n => n.id_referencia !== id));
    navigate(`/${type}/${id}`);
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fas fa-building-user mr-2"></i> CondoApp
      </div>
      
      <nav className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <i className="fas fa-home"></i> Inicio
        </NavLink>

        {/* 2. BOTÓN DE ADMIN */}
        {isAdmin && (
          <NavLink 
            to="/admin/enviar-alerta" 
            className={({ isActive }) => isActive ? "nav-link active admin-link" : "nav-link admin-link"}
            style={{ borderLeft: '4px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}
          >
            <i className="fas fa-bullhorn"></i> Emitir Alerta
          </NavLink>
        )}

        {/* SECCIÓN NOTIFICACIONES */}
        <div className="nav-item-wrapper" style={{ position: 'relative' }}>
          <div 
            className={`nav-link ${notifications.length > 0 ? 'has-notif' : ''}`} 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: 'pointer' }}
          >
            <i className={`fas fa-bell ${notifications.length > 0 ? 'fa-shake' : ''}`} 
               style={{ color: notifications.length > 0 ? '#ffcc00' : 'inherit' }}></i>
            <span> Notificaciones</span>
            {notifications.length > 0 && (
              <span className="notif-badge-count">{notifications.length}</span>
            )}
          </div>

          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="notif-dropdown-menu"
              >
                <div className="notif-header">Notificaciones Recientes</div>
                {notifications.length === 0 ? (
                  <div className="notif-item-detail empty">No tienes avisos nuevos</div>
                ) : (
                  notifications.map((n, index) => (
                    <div 
                      key={index} 
                      className="notif-item-detail" 
                      onClick={() => handleNotifClick(n.type, n.id_referencia)}
                    >
                      <div className={`notif-icon-bg icon-${n.type}`}>
                        {n.type === 'multas' && <i className="fas fa-file-invoice-dollar"></i>}
                        {n.type === 'mensaje' && <i className="fas fa-comment-dots"></i>}
                        {n.type === 'asambleas' && <i className="fas fa-handshake"></i>}
                        {n.type === 'pagos' && <i className="fas fa-money-bill-wave"></i>}
                      </div>
                      <div className="notif-text-content">
                        <strong className="notif-category">{n.type}</strong>
                        <p className="notif-msg-brief">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <NavLink to="/residentes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <i className="fas fa-users"></i> Residentes
        </NavLink>
        
        <NavLink to="/reportes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <i className="fas fa-clipboard-list"></i> Reportes
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <i className="fas fa-comments"></i> Chat
        </NavLink>
      </nav>

      {/* FOOTER CON BOTÓN ANIMADO */}
      <div className="sidebar-footer">
        <motion.button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="nav-link logout-btn"
          style={{ 
            width: '100%', 
            border: 'none', 
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            backgroundColor: isLoggingOut ? 'rgba(255, 0, 0, 0.1)' : 'transparent'
          }}
          whileHover={!isLoggingOut ? { x: 5, backgroundColor: 'rgba(255, 0, 0, 0.05)' } : {}}
          whileTap={!isLoggingOut ? { scale: 0.95 } : {}}
        >
          <AnimatePresence mode="wait">
            {isLoggingOut ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
              >
                <i className="fas fa-circle-notch fa-spin"></i> Saliendo...
              </motion.div>
            ) : (
              <motion.div
                key="static"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <i className="fas fa-right-from-bracket"></i> Cerrar Sesión
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </aside>
  );
}

export default Sidebar;