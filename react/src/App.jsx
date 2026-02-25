import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoGames from './pages/VideoGames';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="page">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/videojuegos" 
              element={
                <ProtectedRoute>
                  <VideoGames />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/usuarios" 
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="wrap footer-content">
            <div>
              <p className="footer-brand">Arcadia Vault</p>
              <p className="footer-note">Interfaz publica para catalogos de videojuegos.</p>
            </div>
            <div className="footer-links">
              <a href="/">Inicio</a>
              <a href="/login">Login</a>
              <a href="/videojuegos">Videojuegos</a>
              <a href="/usuarios">Usuarios</a>
            </div>
            <p className="footer-copy">&copy; 2025 Arcadia Vault. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
