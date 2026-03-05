import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fas fa-building-user mr-2"></i> CondoApp
      </div>
      
      <nav className="nav-links">
  <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
    <i className="fas fa-home"></i> Inicio
  </NavLink>
  
  <NavLink to="/residentes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
    <i className="fas fa-users"></i> Residentes
  </NavLink>
  
  <NavLink to="/anuncios" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
    <i className="fas fa-bullhorn"></i> Anuncios
  </NavLink>
  
  <NavLink to="/reportes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
    <i className="fas fa-clipboard-list"></i> Reportes Pendientes
  </NavLink>

  <NavLink to="/chat" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
    <i className="fas fa-comments"></i> Chat
  </NavLink>

  <NavLink to="/instalaciones" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
    <i className="fas fa-swimming-pool"></i> Instalaciones
  </NavLink>
</nav>
      <div className="sidebar-footer">
        <NavLink to="/configuracion" className="nav-link">
          <i className="fas fa-gear"></i> Configuración
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;