import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-content">
      <section className="section">
        <div className="wrap">
          <div className="empty-state" style={{ padding: '80px 20px' }}>
            <h1 style={{ fontSize: '72px', margin: 0 }}>404</h1>
            <h2 style={{ marginTop: '20px' }}>Pagina no encontrada</h2>
            <p style={{ marginTop: '10px', color: 'var(--muted)' }}>
              La pagina que buscas no existe o ha sido movida.
            </p>
            <Link to="/" className="button button-primary" style={{ marginTop: '30px' }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
