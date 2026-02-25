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
    nombre: '',
    email: '',
    fotoPerfilUrl: '',
    rol: 'usuario',
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
                fotoPerfilUrl: newUser.fotoPerfilUrl?.trim() || null,
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
            nombre: user.nombre || '',
            email: user.email || '',
            fotoPerfilUrl: user.fotoPerfilUrl || '',
            rol: user.rol || 'usuario',
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
        if (editUser.nombre.trim()) {
            payload.nombre = editUser.nombre.trim();
        }
        if (editUser.email.trim()) {
            payload.email = editUser.email.trim();
        }
        if (editUser.fotoPerfilUrl.trim()) {
            payload.fotoPerfilUrl = editUser.fotoPerfilUrl.trim();
        }
        if (editUser.rol && editUser.rol !== users.find(u => u.id === editingUserId)?.rol) {
            payload.rol = editUser.rol;
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
            (user?.nombre || '').toLowerCase().includes(term) || 
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
                            placeholder="Buscar por nombre o email"
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
                                    <span>Nombre</span>
                                    <input
                                        required
                                        value={newUser.nombre}
                                        onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                                        placeholder="Nombre completo"
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
                                        value={newUser.rol}
                                        onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                                    >
                                        <option value="usuario">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </label>
                                <label className="form-field form-field-wide">
                                    <span>Foto de perfil (URL)</span>
                                    <input
                                        value={newUser.fotoPerfilUrl}
                                        onChange={(e) => setNewUser({ ...newUser, fotoPerfilUrl: e.target.value })}
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
                                    <span>Nombre</span>
                                    <input
                                        value={editUser.nombre}
                                        onChange={(e) => setEditUser({ ...editUser, nombre: e.target.value })}
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
                                        value={editUser.rol}
                                        onChange={(e) => setEditUser({ ...editUser, rol: e.target.value })}
                                    >
                                        <option value="usuario">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </label>
                                <label className="form-field form-field-wide">
                                    <span>Foto de perfil (URL)</span>
                                    <input
                                        value={editUser.fotoPerfilUrl}
                                        onChange={(e) => setEditUser({ ...editUser, fotoPerfilUrl: e.target.value })}
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
                                            {user?.fotoPerfilUrl ? (
                                                <img src={user.fotoPerfilUrl} alt={user?.nombre || 'Usuario'} />
                                            ) : (
                                                <Users size={20} />
                                            )}
                                        </div>
                                        <span className="tag">ID {user?.id || 'N/A'}</span>
                                    </div>
                                    <h3>{user?.nombre || 'Sin nombre'}</h3>
                                    <p className="card-meta">
                                        <Mail size={16} /> {user?.email || 'Sin email'}
                                    </p>
                                    <div className="role-row">
                                        {user?.rol === 'admin' ? (
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
