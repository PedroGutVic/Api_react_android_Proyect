import { Link } from 'react-router-dom';
import authService from '../api/auth';
import { motion } from 'framer-motion';
import { Gamepad2, Users, ShieldAlert, Sparkles, Trophy, Star, ChevronRight } from 'lucide-react';

const Home = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  const stats = [
    { label: 'Catálogo Activo', value: '120+', icon: <Gamepad2 size={20} />, color: 'var(--teal)' },
    { label: 'Usuarios Verificados', value: '9.8k', icon: <Users size={20} />, color: 'var(--accent)' },
    { label: 'Seguridad Certificada', value: '100%', icon: <Trophy size={20} />, color: '#fbbf24' },
  ];

  // Variantes de Framer Motion para animación coordinada escalonada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="page-content">
      {/* Sección Hero */}
      <section className="section hero">
        <div className="wrap">
          <motion.div 
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Texto y Llamadas a la Acción */}
            <div>
              <motion.span className="eyebrow" variants={itemVariants}>
                <Sparkles size={12} style={{ marginRight: '6px', display: 'inline' }} />
                Plataforma de Videojuegos
              </motion.span>
              <motion.h1 className="hero-title" variants={itemVariants}>
                Un escaparate moderno para tu API de juegos.
              </motion.h1>
              <motion.p className="hero-subtitle" variants={itemVariants}>
                Gestiona catálogos, marca tus favoritos, personaliza tu perfil gamer y administra tu comunidad con una interfaz pensada para el público.
              </motion.p>
              
              <motion.div className="hero-actions" variants={itemVariants}>
                {isAuthenticated ? (
                  <>
                    <Link className="button button-primary" to="/videojuegos">
                      Explorar Catálogo <ChevronRight size={16} />
                    </Link>
                    {user?.role === 'admin' && (
                      <Link className="button button-outline" to="/usuarios">
                        Gestionar Usuarios
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link className="button button-primary" to="/register">
                      Crear Cuenta Gamer
                    </Link>
                    <Link className="button button-outline" to="/login">
                      Iniciar Sesión
                    </Link>
                  </>
                )}
              </motion.div>
              
              <motion.div className="hero-note" variants={itemVariants}>
                <span className="pill">Ktor API</span>
                <span className="pill">Glassmorphic UI</span>
                <span className="pill">Real-Time Control</span>
              </motion.div>
            </div>

            {/* Tarjeta Visual de Estado */}
            <motion.div 
              className="hero-card"
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="hero-card-header">
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={16} fill="var(--teal)" stroke="var(--teal)" />
                  Servicio Activo (Online)
                </p>
                <span className="status-dot" />
              </div>
              
              <div className="stat-grid">
                {stats.map((item) => (
                  <div key={item.label} className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: `${item.color}15`,
                      color: item.color,
                      display: 'grid',
                      placeItems: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="stat-label" style={{ margin: 0 }}>{item.label}</p>
                      <p className="stat-value" style={{ margin: 0, fontSize: '20px' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="hero-card-footer">
                <span style={{ fontSize: '13px' }}>Sesión Iniciada:</span>
                <strong style={{ color: 'var(--teal-dark)', fontWeight: '700' }}>
                  {user ? user.username : 'Modo Invitado'}
                </strong>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sección Características */}
      <section className="section" style={{ borderTop: '1px solid var(--line)', background: 'var(--surface-alt)', transition: 'background-color 0.4s ease' }}>
        <div className="wrap">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p className="eyebrow">Características</p>
              <h2 className="section-title">Todo lo que necesitas</h2>
              <p className="section-desc">
                Una plataforma completa y veloz para administrar tus datos de manera interactiva.
              </p>
            </div>
          </div>
          
          <motion.div 
            className="feature-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">🎮</div>
              <h3>Catálogo de Videojuegos</h3>
              <p>Busca, añade, modifica e inspecciona tus videojuegos favoritos con insignias inteligentes de plataformas.</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">👥</div>
              <h3>Gestión de Comunidad</h3>
              <p>Controla usuarios y roles de administración. Actualiza avatares gamer de forma interactiva.</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">🔐</div>
              <h3>Seguridad con JWT</h3>
              <p>Autenticación robusta basada en JSON Web Tokens con sistema automatizado de auto-refresco.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
