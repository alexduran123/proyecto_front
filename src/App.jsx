import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat'; // Verifica que la ruta al archivo sea correcta

function App() {
  return (
    <Router>
      {/* Contenedor principal con flex */}
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        
        {/* El Sidebar mantiene su ancho fijo (ejemplo 250px) */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* El contenido crece para ocupar el resto y no se encima */}
        <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#f8f9fa' }}>
          <Routes>
            <Route path="/chat" element={<Chat />} />
            {/* ... otras rutas */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;