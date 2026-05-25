import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Gamepad2, Users, LogIn, UserPlus, Sun, Moon } from 'lucide-react';
import authService from '../api/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="nav">
      <Link to="/" className="nav-brand">
        🎮 Arcadia Vault
      </Link>
      
      <nav className="nav-links">
        <Link to="/" className={isActive('/')}>
          <Home size={18} /> Inicio
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/videojuegos" className={isActive('/videojuegos')}>
              <Gamepad2 size={18} /> Videojuegos
            </Link>
            {user?.role === 'admin' && (
              <Link to="/usuarios" className={isActive('/usuarios')}>
                <Users size={18} /> Usuarios
              </Link>
            )}
          </>
        )}
      </nav>

      <div className="nav-actions">
        <button 
          onClick={() => setIsDark(!isDark)} 
          className="theme-toggle" 
          title="Cambiar Modo"
          aria-label="Cambiar Modo"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {isAuthenticated ? (
          <>
            <Link to="/perfil" className="user-info" title="Ver mi perfil" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              Hola, <strong>{user?.username}</strong>
              {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
            </Link>
            <button className="button button-outline" onClick={handleLogout}>
              <LogOut size={18} /> Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link className="button button-ghost" to="/login">
              <LogIn size={18} /> Login
            </Link>
            <Link className="button button-primary" to="/register">
              <UserPlus size={18} /> Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
