import { Link } from 'react-router-dom';
import authService from '../api/auth';

const Home = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  const stats = [
    { label: 'Catalogo activo', value: '120+' },
    { label: 'Actualizaciones semanales', value: '24' },
    { label: 'Usuarios verificados', value: '9.8k' },
  ];

  return (
    <div className="page-content">
      <section className="section hero">
        <div className="wrap hero-content">
          <div>
            <p className="eyebrow">Plataforma publica de videojuegos</p>
            <h1 className="hero-title">
              Un escaparate moderno para tu API de juegos y usuarios.
            </h1>
            <p className="hero-subtitle">
              Gestiona el catalogo, presenta tu comunidad y ofrece un acceso limpio con un diseno pensado para el publico.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <Link className="button button-primary" to="/videojuegos">Explorar catalogo</Link>
                  {user?.role === 'admin' && (
                    <Link className="button button-outline" to="/usuarios">Gestionar usuarios</Link>
                  )}
                </>
              ) : (
                <>
                  <Link className="button button-primary" to="/register">Crear cuenta</Link>
                  <Link className="button button-outline" to="/login">Iniciar sesion</Link>
                </>
              )}
            </div>
            <div className="hero-note">
              <span className="pill">Ktor + React</span>
              <span className="pill">UI publica</span>
              <span className="pill">Gestion en vivo</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-header">
              <p>Estado en tiempo real</p>
              <span className="status-dot" />
            </div>
            <div className="stat-grid">
              {stats.map((item) => (
                <div key={item.label} className="stat-item">
                  <p className="stat-label">{item.label}</p>
                  <p className="stat-value">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="hero-card-footer">
              <p>Sesion activa</p>
              <strong>{user ? user.username : 'Invitado'}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Caracteristicas</p>
              <h2 className="section-title">Todo lo que necesitas</h2>
              <p className="section-desc">
                Una plataforma completa para gestionar tu catalogo de videojuegos.
              </p>
            </div>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Gestion de Videojuegos</h3>
              <p>Añade, edita y elimina juegos de tu catalogo con facilidad.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Control de Usuarios</h3>
              <p>Administra usuarios y roles desde un panel intuitivo.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Seguridad JWT</h3>
              <p>Autenticacion robusta con tokens JWT y refresh automatico.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
