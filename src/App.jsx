import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat'; 
import Login from './pages/LoginPage'; // Eliminado el espacio extra en el nombre
import AdminNotifPage from './pages/AdminNotifPage';

function App() {
  // Función para verificar si hay un token guardado
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Si ya estoy logueado y trato de ir a /login, me manda al chat */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/chat" /> : <Login />} />

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

export default App; // Eliminada la llave extra al final