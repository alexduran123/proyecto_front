import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat'; 
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage'; 
import AdminNotifPage from './pages/AdminNotifPage';
import ChangePasswordPage from './pages/ChangePasswordPage'; // Importamos la nueva vista

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/chat" /> : <Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            isAuthenticated() ? (
              <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
                <div style={{ width: '250px', flexShrink: 0 }}>
                  <Sidebar />
                </div>
                <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#f8f9fa' }}>
                  <Routes>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/admin/enviar-alerta" element={<AdminNotifPage />} />
                    
                    {/* NUEVA RUTA: Cambio de contraseña */}
                    <Route path="/cambiar-clave" element={<ChangePasswordPage />} />
                    
                    <Route path="/" element={<Navigate to="/chat" />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;