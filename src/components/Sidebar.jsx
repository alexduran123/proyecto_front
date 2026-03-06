import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import echo from '../echo';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  
  // ESTADOS
  const [notifications, setNotifications] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    navigate('/login');
    window.location.reload();
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

        {/* 2. BOTÓN DE ADMIN (Ahora lee el campo 'role') */}
        {isAdmin && (
          <NavLink 
            to="/admin/enviar-alerta" 
            className={({ isActive }) => isActive ? "nav-link active admin-link" : "nav-link admin-link"}
            style={{ borderLeft: '4px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}
          >
            <i className="fas fa-bullhorn"></i> Emitir Alerta
          </NavLink>
        )}

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

          {showDropdown && (
            <div className="notif-dropdown-menu">
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
            </div>
          )}
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

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-link logout-btn">
          <i className="fas fa-right-from-bracket"></i> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;