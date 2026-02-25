import { useEffect, useMemo, useState } from 'react';
import { userApi } from '../api/client';
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
        } catch (err) {
            alert('No se pudo crear el usuario.');
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
        }
        if (editUser.role && editUser.role !== users.find(u => u.id === editingUserId)?.role) {
            payload.role = editUser.role;
        }

        if (Object.keys(payload).length === 0) {
            alert('No se detectaron cambios.');
            return;
        }

        try {
            await userApi.update(editingUserId, payload);
            cancelEditing();
            fetchUsers();
        } catch (err) {
            alert('No se pudo actualizar el usuario.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await userApi.delete(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (err) {
            alert('No se pudo eliminar el usuario.');
        }
    };

    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];
        const term = search.toLowerCase();
        return users.filter((user) =>
            (user?.username || '').toLowerCase().includes(term) || 
            (user?.email || '').toLowerCase().includes(term)
        );
    }, [users, search]);

    return (
        <section id="usuarios" className="section">
            <div className="wrap">
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Comunidad</p>
                        <h2 className="section-title">Usuarios</h2>
                        <p className="section-desc">
                            Administra perfiles con un panel claro y ordenado.
                        </p>
                    </div>
                    <div className="section-actions">
                        <button onClick={fetchUsers} className="button button-outline">
                            <RefreshCw size={18} /> Actualizar
                        </button>
                        <button onClick={() => setIsAdding((prev) => !prev)} className="button button-primary">
                            {isAdding ? <X size={18} /> : <UserPlus size={18} />} {isAdding ? 'Cerrar' : 'Nuevo usuario'}
                        </button>
                    </div>
                </div>

                <div className="toolbar">
                    <div className="search">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Buscar por username o email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="panel form-panel"
                        >
                            <div className="panel-head">
                                <h3>Nuevo usuario</h3>
                                <button type="button" className="button button-ghost" onClick={() => setIsAdding(false)}>
                                    <X size={18} /> Cerrar
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="form-grid">
                                <label className="form-field">
                                    <span>Username</span>
                                    <input
                                        required
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                        placeholder="Nombre de usuario"
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Email</span>
                                    <input
                                        required
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="usuario@dominio.com"
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Rol</span>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </label>
                                <label className="form-field form-field-wide">
                                    <span>Avatar URL</span>
                                    <input
                                        value={newUser.avatar_url}
                                        onChange={(e) => setNewUser({ ...newUser, avatar_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </label>
                                <div className="form-actions">
                                    <button type="submit" className="button button-primary">
                                        Guardar usuario
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {editingUserId != null && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="panel form-panel"
                        >
                            <div className="panel-head">
                                <h3>Editar usuario</h3>
                                <button type="button" className="button button-ghost" onClick={cancelEditing}>
                                    <X size={18} /> Cerrar
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="form-grid">
                                <label className="form-field">
                                    <span>Username</span>
                                    <input
                                        value={editUser.username}
                                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Email</span>
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Rol</span>
                                    <select
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </label>
                                <label className="form-field form-field-wide">
                                    <span>Avatar URL</span>
                                    <input
                                        value={editUser.avatar_url}
                                        onChange={(e) => setEditUser({ ...editUser, avatar_url: e.target.value })}
                                    />
                                </label>
                                <div className="form-actions">
                                    <button type="submit" className="button button-primary">
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading && users.length === 0 ? (
                    <div className="empty-state">
                        <div className="loader" />
                        <p>Cargando usuarios...</p>
                    </div>
                ) : (
                    <div className="card-grid user-grid">
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((user) => (
                                <motion.article
                                    layout
                                    key={user.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    className="card user-card"
                                >
                                    <div className="card-header">
                                        <div className="avatar">
                                            {user?.avatar_url ? (
                                                <img src={user.avatar_url} alt={user?.username || 'Usuario'} />
                                            ) : (
                                                <Users size={20} />
                                            )}
                                        </div>
                                        <span className="tag">ID {user?.id || 'N/A'}</span>
                                    </div>
                                    <h3>{user?.username || 'Sin username'}</h3>
                                    <p className="card-meta">
                                        <Mail size={16} /> {user?.email || 'Sin email'}
                                    </p>
                                    <div className="role-row">
                                        {user?.role === 'admin' ? (
                                            <span className="role-badge role-admin">
                                                <Shield size={14} /> Admin
                                            </span>
                                        ) : (
                                            <span className="role-badge role-user">
                                                <UserCheck size={14} /> Usuario
                                            </span>
                                        )}
                                    </div>
                                    <div className="card-actions">
                                        <button className="button button-outline" onClick={() => startEditing(user)}>
                                            <Pencil size={16} /> Editar
                                        </button>
                                        <button className="button button-ghost" onClick={() => handleDelete(user.id)}>
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredUsers.length === 0 && (
                    <div className="empty-state">
                        <p>No hay usuarios para mostrar.</p>
                    </div>
                )}

                {error && !loading && <div className="message message-error">{error}</div>}
            </div>
        </section>
    );
};

export default UserManagement;
