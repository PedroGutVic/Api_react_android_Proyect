import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/auth';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, ShieldCheck, Sparkles, Star } from 'lucide-react';

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
      setMessage('Completa todos los campos obligatorios.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setMessage(null);
    setStatus('idle');

    try {
      const response = await authService.login(email.trim().toLowerCase(), password.trim());
      setMessage(`¡Bienvenido de vuelta, ${response.user.username}!`);
      setStatus('success');
      
      // Lanzar evento global para recargar estados de autenticación
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        navigate('/videojuegos');
      }, 600);
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Credenciales inválidas. Inténtalo de nuevo.';
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
          <motion.div 
            className="auth-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Panel de Formulario */}
            <div className="auth-box">
              <div className="auth-header">
                <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={12} /> Acceso Seguro
                </span>
                <h1 style={{ marginTop: '8px', fontFamily: 'Fraunces', fontWeight: '700' }}>Iniciar Sesión</h1>
                <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Accede a tu cuenta de Arcadia Vault</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <label className="form-field">
                  <span>Correo Electrónico</span>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--muted)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@dominio.com"
                      autoComplete="email"
                      required
                      style={{ paddingLeft: '42px', width: '100%' }}
                    />
                  </div>
                </label>

                <label className="form-field">
                  <span>Contraseña</span>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--muted)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      autoComplete="current-password"
                      minLength={6}
                      required
                      style={{ paddingLeft: '42px', width: '100%' }}
                    />
                  </div>
                </label>

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`message ${status === 'success' ? 'message-success' : 'message-error'}`}
                  >
                    {message}
                  </motion.div>
                )}

                <button type="submit" className="button button-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '10px' }}>
                  {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'} <ChevronRight size={16} />
                </button>
              </form>

              <div className="auth-footer" style={{ borderTop: '1px solid var(--line)', paddingTop: '24px', marginTop: '24px' }}>
                <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--teal)', fontWeight: '700' }}>Regístrate aquí</Link>
                </p>
                <Link to="/" style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '600' }}>Volver al Inicio</Link>
              </div>
            </div>

            {/* Panel de Información / Ilustrativo */}
            <div className="auth-info">
              <span className="eyebrow" style={{ color: 'var(--teal)' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '6px' }} />
                Beneficios del Vault
              </span>
              <h3 style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>
                Únete a la colección de juegos.
              </h3>
              
              <ul className="feature-list" style={{ marginTop: '10px' }}>
                <li>Crea listas de deseos y guarda tus favoritos locales.</li>
                <li>Consulta estadísticas globales en tiempo real.</li>
                <li>Sesión en vivo súper rápida blindada con JWT.</li>
              </ul>
              
              <div className="highlight-box" style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)' }}>
                <p className="highlight-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--teal)' }} />
                  Seguridad Incorporada
                </p>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                  Tus contraseñas están fuertemente encriptadas usando algoritmos BCrypt de 12 rondas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Login;
