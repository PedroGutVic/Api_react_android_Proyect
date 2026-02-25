import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('idle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage('Completa todos los campos.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setMessage(null);
    setStatus('idle');

    try {
      const response = await authService.login(email.trim().toLowerCase(), password.trim());
      setMessage(`Bienvenido, ${response.user.username}!`);
      setStatus('success');
      setTimeout(() => {
        navigate('/videojuegos');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Credenciales incorrectas. Intenta nuevamente.';
      setMessage(errorMsg);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <section className="section auth-section">
        <div className="wrap">
          <div className="auth-container">
            <div className="auth-box">
              <div className="auth-header">
                <h1>Iniciar Sesion</h1>
                <p>Accede a tu cuenta de Arcadia Vault</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <label className="form-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@dominio.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="form-field">
                  <span>Contraseña</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    minLength={6}
                    required
                  />
                </label>
                {message && (
                  <div className={`message ${status === 'success' ? 'message-success' : 'message-error'}`}>
                    {message}
                  </div>
                )}
                <button type="submit" className="button button-primary" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="auth-footer">
                <p>¿No tienes cuenta? <Link to="/register">Registrate aqui</Link></p>
                <Link to="/">Volver al inicio</Link>
              </div>
            </div>

            <div className="auth-info">
              <h3>Accede a tu cuenta</h3>
              <ul className="feature-list">
                <li>Gestiona tu catalogo de videojuegos</li>
                <li>Accede a funciones exclusivas</li>
                <li>Sesion segura con JWT</li>
              </ul>
              <div className="highlight-box">
                <p className="highlight-title">Seguridad</p>
                <p>Tu información está protegida con autenticación JWT.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
