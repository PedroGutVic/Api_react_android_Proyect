import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/auth';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('idle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !email || !password) {
      setMessage('Completa todos los campos.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setMessage(null);
    setStatus('idle');

    try {
      await authService.register(
        username.trim(), 
        email.trim().toLowerCase(), 
        password.trim()
      );
      setMessage('Cuenta creada exitosamente! Redirigiendo...');
      setStatus('success');
      setTimeout(() => {
        navigate('/videojuegos');
      }, 1000);
    } catch (error) {
      console.error('Register error:', error);
      const isConflict = error.response?.status === 409;

      const errorMsg = isConflict
        ? 'Ese email ya esta registrado. Inicia sesion con tus credenciales.'
        : error.response?.data?.message
          || error.response?.data?.error
          || 'Error al crear la cuenta. Intenta nuevamente.';
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
                <h1>Crear Cuenta</h1>
                <p>Registrate en Arcadia Vault</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <label className="form-field">
                  <span>Nombre de usuario</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu nombre"
                    autoComplete="username"
                    required
                  />
                </label>
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
                    placeholder="Minimo 6 caracteres"
                    autoComplete="new-password"
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
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              <div className="auth-footer">
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesion aqui</Link></p>
                <Link to="/">Volver al inicio</Link>
              </div>
            </div>

            <div className="auth-info">
              <h3>Unete a nosotros</h3>
              <ul className="feature-list">
                <li>Acceso completo al catalogo</li>
                <li>Gestiona tus videojuegos favoritos</li>
                <li>Interfaz moderna y rapida</li>
              </ul>
              <div className="highlight-box">
                <p className="highlight-title">¿Por que registrarse?</p>
                <p>Accede a todas las funcionalidades y mantén tu información segura.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
