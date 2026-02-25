import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Gamepad2, Users, LogIn, UserPlus } from 'lucide-react';
import authService from '../api/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

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
        Arcadia Vault
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
        {isAuthenticated ? (
          <>
            <span className="user-info">
              Hola, <strong>{user?.username}</strong>
              {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
            </span>
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
