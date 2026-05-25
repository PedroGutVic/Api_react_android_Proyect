import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../api/auth';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ChevronRight, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

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
      setMessage('Completa todos los campos obligatorios.');
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
      setMessage('¡Cuenta creada exitosamente! Redirigiendo...');
      setStatus('success');
      
      // Lanzar evento global para recargar estados de autenticación
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        navigate('/videojuegos');
      }, 800);
    } catch (error) {
      console.error('Register error:', error);
      const isConflict = error.response?.status === 409;

      const errorMsg = isConflict
        ? 'Ese correo ya está registrado. Inicia sesión con tus credenciales.'
        : error.response?.data?.message
          || error.response?.data?.error
          || 'Error al crear la cuenta. Inténtalo de nuevo.';
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
                  <Sparkles size={12} /> Registro Rápido
                </span>
                <h1 style={{ marginTop: '8px', fontFamily: 'Fraunces', fontWeight: '700' }}>Crear Cuenta</h1>
                <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Regístrate en Arcadia Vault para empezar</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <label className="form-field">
                  <span>Nombre de Usuario</span>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--muted)' }} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ej: lucas_gamer"
                      autoComplete="username"
                      required
                      style={{ paddingLeft: '42px', width: '100%' }}
                    />
                  </div>
                </label>

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
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
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
                  {loading ? 'Creando Cuenta...' : 'Crear Cuenta'} <ChevronRight size={16} />
                </button>
              </form>

              <div className="auth-footer" style={{ borderTop: '1px solid var(--line)', paddingTop: '24px', marginTop: '24px' }}>
                <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: '700' }}>Inicia sesión aquí</Link>
                </p>
                <Link to="/" style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '600' }}>Volver al Inicio</Link>
              </div>
            </div>

            {/* Panel de Información / Ilustrativo */}
            <div className="auth-info">
              <span className="eyebrow" style={{ color: 'var(--teal)' }}>
                <UserCheck size={12} style={{ display: 'inline', marginRight: '6px' }} />
                Comunidad Arcadia
              </span>
              <h3 style={{ fontFamily: 'Fraunces', fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>
                Tu pasaporte gamer te espera.
              </h3>
              
              <ul className="feature-list" style={{ marginTop: '10px' }}>
                <li>Únete al directorio de usuarios interactivo.</li>
                <li>Mapea tus consolas favoritas y precios de juegos.</li>
                <li>Desbloquea el panel para gestionar títulos si eres Admin.</li>
              </ul>
              
              <div className="highlight-box" style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)' }}>
                <p className="highlight-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--teal)' }} />
                  Privacidad Garantizada
                </p>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                  Cumplimos con las mejores directrices de encriptación hashing para salvaguardar tu perfil.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Register;
