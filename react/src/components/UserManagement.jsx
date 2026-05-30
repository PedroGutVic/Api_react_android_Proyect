import { useCallback, useEffect, useMemo, useState } from 'react';
import { userApi } from '../api/client';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import useDebounce from '../hooks/useDebounce';
import useEscapeKey from '../hooks/useEscapeKey';
import { SkeletonUserCard } from './Skeleton';
import {
    UserPlus,
    Users,
    Mail,
    Trash2,
    Pencil,
    Search,
    RefreshCw,
    X,
    Shield,
    UserCheck,
    Sparkles,
    Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyUser = {
    username: '',
    email: '',
    avatar_url: '',
    role: 'user',
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState(emptyUser);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editUser, setEditUser] = useState(emptyUser);

    const showToast = useToast();
    const confirm = useConfirm();
    const debouncedSearch = useDebounce(search, 200);

    const handleEscape = useCallback(() => {
        if (editingUserId != null) { cancelEditing(); return; }
        if (isAdding) { setIsAdding(false); }
    }, [editingUserId, isAdding]);
    useEscapeKey(handleEscape);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAll();
            setUsers(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setUsers([]);
            const msg = err.response?.status === 401
                ? 'API requiere autenticacion. Configura tus credenciales o habilita acceso publico.'
                : err.response?.data || 'No se pudo cargar el directorio.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newUser,
                id: 0,
                avatar_url: newUser.avatar_url?.trim() || null,
            };
            await userApi.create(payload);
            setNewUser(emptyUser);
            setIsAdding(false);
            fetchUsers();
            showToast('Usuario registrado correctamente.', 'success');
        } catch (err) {
            showToast('No se pudo crear el usuario.', 'error');
        }
    };

    const startEditing = (user) => {
        setEditingUserId(user.id);
        setEditUser({
            username: user.username || '',
            email: user.email || '',
            avatar_url: user.avatar_url || '',
            role: user.role || 'user',
        });
    };

    const cancelEditing = () => {
        setEditingUserId(null);
        setEditUser(emptyUser);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (editingUserId == null) {
            return;
        }

        const payload = {};
        if (editUser.username.trim()) {
            payload.username = editUser.username.trim();
        }
        if (editUser.email.trim()) {
            payload.email = editUser.email.trim();
        }
        if (editUser.avatar_url.trim()) {
            payload.avatar_url = editUser.avatar_url.trim();
        } else {
            payload.avatar_url = null;
        }
        if (editUser.role) {
            payload.role = editUser.role;
        }

        try {
            await userApi.update(editingUserId, payload);
            cancelEditing();
            fetchUsers();
            showToast('Usuario actualizado correctamente.', 'success');
        } catch (err) {
            showToast('No se pudo actualizar el usuario.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm('¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.');
        if (!ok) return;
        try {
            await userApi.delete(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            showToast('Usuario eliminado del directorio.', 'success');
        } catch (err) {
            showToast('No se pudo eliminar el usuario.', 'error');
        }
    };

    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];
        const term = debouncedSearch.toLowerCase();
        return users.filter((user) =>
            (user?.username || '').toLowerCase().includes(term) ||
            (user?.email || '').toLowerCase().includes(term)
        );
    }, [users, debouncedSearch]);

    return (
        <section id="usuarios" className="section">
            <div className="wrap">
                {/* Cabecera del Panel de Control */}
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Administración</p>
                        <h2 className="section-title">Comunidad y Usuarios</h2>
                        <p className="section-desc">
                            Gestiona perfiles, asigna roles de administración y supervisa a los miembros registrados.
                        </p>
                    </div>
                    <div className="section-actions">
                        <button onClick={fetchUsers} className="button button-outline" title="Actualizar Directorio">
                            <RefreshCw size={16} /> Actualizar
                        </button>
                        <button onClick={() => setIsAdding(true)} className="button button-primary">
                            <UserPlus size={16} /> Nuevo usuario
                        </button>
                    </div>
                </div>

                {/* Filtro de Búsqueda */}
                <div className="toolbar">
                    <div className="search">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Buscar por nombre o dirección de correo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Modal Crear Usuario */}
                <AnimatePresence>
                    {isAdding && (
                        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                                transition={{ duration: 0.25 }}
                                className="modal-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h3 style={{ fontFamily: 'Fraunces', fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sparkles size={20} style={{ color: 'var(--teal)' }} />
                                        Registrar Nuevo Usuario
                                    </h3>
                                    <button type="button" className="theme-toggle" onClick={() => setIsAdding(false)}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleAdd} className="form">
                                        <div className="form-grid">
                                            <label className="form-field">
                                                <span>Username</span>
                                                <input
                                                    required
                                                    value={newUser.username}
                                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                                    placeholder="Ej: lucas_gamer"
                                                />
                                            </label>
                                            <label className="form-field">
                                                <span>Correo Electrónico</span>
                                                <input
                                                    required
                                                    type="email"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                    placeholder="correo@dominio.com"
                                                />
                                            </label>
                                            <label className="form-field">
                                                <span>Rol Administrativo</span>
                                                <select
                                                    value={newUser.role}
                                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                                >
                                                    <option value="user">Usuario Común</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </label>
                                        </div>
                                        <label className="form-field">
                                            <span>URL de Imagen del Avatar</span>
                                            <input
                                                value={newUser.avatar_url}
                                                onChange={(e) => setNewUser({ ...newUser, avatar_url: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </label>
                                        <div className="form-actions">
                                            <button type="button" className="button button-ghost" onClick={() => setIsAdding(false)}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="button button-primary">
                                                Registrar Miembro
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Modal Editar Usuario */}
                <AnimatePresence>
                    {editingUserId != null && (
                        <div className="modal-overlay" onClick={cancelEditing}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                                transition={{ duration: 0.25 }}
                                className="modal-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h3 style={{ fontFamily: 'Fraunces', fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Pencil size={18} style={{ color: 'var(--teal)' }} />
                                        Modificar Datos de Usuario
                                    </h3>
                                    <button type="button" className="theme-toggle" onClick={cancelEditing}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleUpdate} className="form">
                                        <div className="form-grid">
                                            <label className="form-field">
                                                <span>Username</span>
                                                <input
                                                    required
                                                    value={editUser.username}
                                                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                                />
                                            </label>
                                            <label className="form-field">
                                                <span>Correo Electrónico</span>
                                                <input
                                                    required
                                                    type="email"
                                                    value={editUser.email}
                                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                                />
                                            </label>
                                            <label className="form-field">
                                                <span>Rol de Usuario</span>
                                                <select
                                                    value={editUser.role}
                                                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                                >
                                                    <option value="user">Usuario Común</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </label>
                                        </div>
                                        <label className="form-field">
                                            <span>URL de Imagen del Avatar</span>
                                            <input
                                                value={editUser.avatar_url}
                                                onChange={(e) => setEditUser({ ...editUser, avatar_url: e.target.value })}
                                            />
                                        </label>
                                        <div className="form-actions">
                                            <button type="button" className="button button-ghost" onClick={cancelEditing}>
                                                Descartar
                                            </button>
                                            <button type="submit" className="button button-primary">
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Directorio de tarjetas de usuario */}
                {/* Contador de resultados */}
                {!loading && (
                    <div className="results-bar">
                        <span className="results-count">
                            {filteredUsers.length === users.length
                                ? `${users.length} miembros registrados`
                                : `${filteredUsers.length} de ${users.length} miembros`}
                        </span>
                        {debouncedSearch && (
                            <button
                                className="button button-ghost"
                                style={{ fontSize: 12, padding: '4px 12px' }}
                                onClick={() => setSearch('')}
                            >
                                <X size={12} /> Limpiar búsqueda
                            </button>
                        )}
                    </div>
                )}

                {loading && users.length === 0 ? (
                    <div className="card-grid">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonUserCard key={i} />)}
                    </div>
                ) : (
                    <div className="card-grid">
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((user) => (
                                <motion.article
                                    layout
                                    key={user.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.25 }}
                                    className="card user-card"
                                >
                                    <div className="card-header" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '10px' }}>
                                        <div className="avatar">
                                            {user?.avatar_url || user?.avatarUrl ? (
                                                <img src={user.avatar_url || user.avatarUrl} alt={user?.username || 'Miembro'} />
                                            ) : (
                                                <Users size={22} />
                                            )}
                                        </div>
                                        <span className="tag">ID {user?.id || 'N/A'}</span>
                                    </div>
                                    
                                    <h3 style={{ fontFamily: 'Fraunces', fontSize: '20px', fontWeight: '700' }}>
                                        {user?.username || 'Sin username'}
                                    </h3>
                                    
                                    <p className="card-meta" style={{ fontSize: '14px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Mail size={14} /> {user?.email || 'Sin correo registrado'}
                                    </p>
                                    
                                    <div style={{ marginTop: '8px' }}>
                                        {user?.role === 'admin' ? (
                                            <span className="role-badge role-admin">
                                                <Shield size={12} /> Administrador
                                            </span>
                                        ) : (
                                            <span className="role-badge role-user">
                                                <UserCheck size={12} /> Miembro Común
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="card-actions" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: '16px' }}>
                                        <button className="button button-outline" onClick={() => startEditing(user)}>
                                            <Pencil size={14} /> Modificar
                                        </button>
                                        <button 
                                            className="button button-ghost" 
                                            style={{ color: '#ef4444' }} 
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Búsqueda vacía */}
                {!loading && filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <Users size={48} style={{ color: 'var(--muted)', opacity: 0.6 }} />
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>Directorio vacío</h3>
                        <p style={{ maxWidth: '300px' }}>
                            No hay miembros que coincidan con los criterios de búsqueda actuales.
                        </p>
                    </div>
                )}

                {error && !loading && <div className="message message-error">{error}</div>}
            </div>
        </section>
    );
};

export default UserManagement;
