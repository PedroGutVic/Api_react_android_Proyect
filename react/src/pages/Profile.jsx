import { useState, useEffect } from 'react';
import { userApi } from '../api/client';
import { authService } from '../api/auth';
import { Shield, User, Mail, Save, Image, Sparkles } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('idle');

  // Avatares rápidos prediseñados para hacer el perfil premium y divertido
  const presetAvatares = [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=150&auto=format&fit=crop', // Gamer Boy
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', // Gamer Girl
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', // Creative
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', // Vibrant
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop', // Tech
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop', // Fantasy
  ];

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
      setAvatarUrl(currentUser.avatarUrl || currentUser.avatar_url || '');
    }
  }, []);

  const handlePresetSelect = (url) => {
    setAvatarUrl(url);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);
    setStatus('idle');

    try {
      const payload = {
        username: user.username,
        email: user.email,
        avatar_url: avatarUrl.trim() || null,
        role: user.role,
      };

      await userApi.update(user.id, payload);
      
      // Actualizar localStorage
      const updatedUser = {
        ...user,
        avatarUrl: payload.avatar_url,
        avatar_url: payload.avatar_url,
      };
      
      authService.setUser(updatedUser);
      setUser(updatedUser);
      
      setMessage('¡Perfil actualizado con éxito!');
      setStatus('success');
      
      // Actualizar la cabecera forzando recarga de evento de almacenamiento o refrescando
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setMessage('No se pudo actualizar el avatar en el servidor.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-content" style={{ display: 'grid', placeItems: 'center', height: '400px' }}>
        <div className="loader" />
        <p style={{ marginTop: '16px', fontWeight: '600' }}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Ajustes Personales</p>
              <h2 className="section-title">Mi Perfil</h2>
              <p className="section-desc">
                Personaliza tu presencia digital en Arcadia Vault y gestiona tu información.
              </p>
            </div>
          </div>

          <div className="profile-container">
            {/* Tarjeta de visualización */}
            <div className="profile-card">
              <div className="profile-avatar-large">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.username} />
                ) : (
                  <User size={64} style={{ opacity: 0.6, marginTop: '25px' }} />
                )}
              </div>
              <h3 className="profile-name">{user.username}</h3>
              <p className="profile-email">{user.email}</p>
              
              <div style={{ marginTop: '8px' }}>
                {user.role === 'admin' ? (
                  <span className="role-badge role-admin">
                    <Shield size={14} /> Administrador
                  </span>
                ) : (
                  <span className="role-badge role-user">
                    <User size={14} /> Usuario
                  </span>
                )}
              </div>
            </div>

            {/* Formulario de edición */}
            <div className="panel" style={{ background: 'var(--surface)' }}>
              <div className="panel-head">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} style={{ color: 'var(--teal)' }} /> Personalizar Avatar
                </h3>
              </div>
              
              <form className="form" onSubmit={handleUpdateProfile}>
                <div className="form-field">
                  <span>Elige un avatar gamer rápido:</span>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '8px' }}>
                    {presetAvatares.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePresetSelect(url)}
                        style={{
                          border: avatarUrl === url ? '3px solid var(--teal)' : '2px solid var(--line)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          width: '56px',
                          height: '56px',
                          cursor: 'pointer',
                          padding: 0,
                          transform: avatarUrl === url ? 'scale(1.08)' : 'none',
                          boxShadow: avatarUrl === url ? '0 4px 12px rgba(20,184,166,0.2)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <img src={url} alt={`Preset ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                </div>

                <label className="form-field">
                  <span>URL de Avatar Personalizada</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://ejemplo.com/mi-avatar.jpg"
                      style={{ flex: 1 }}
                    />
                    {avatarUrl && (
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={() => setAvatarUrl('')}
                        style={{ padding: '12px' }}
                        title="Limpiar"
                      >
                        <Save size={16} style={{ display: 'none' }} /> Limpiar
                      </button>
                    )}
                  </div>
                </label>

                {message && (
                  <div className={`message ${status === 'success' ? 'message-success' : 'message-error'}`}>
                    {message}
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="button button-primary" disabled={loading}>
                    <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
