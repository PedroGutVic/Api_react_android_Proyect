import { useEffect, useMemo, useState } from 'react';
import { userApi } from '../api/client';
import {
    UserPlus,
    Users,
    Mail,
    Key,
    Trash2,
    Pencil,
    Search,
    RefreshCw,
    X,
    Info,
    Shield,
    UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyUser = {
    nombre: '',
    email: '',
    passwordHash: '',
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
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data || 'Failed to connect to the user directory.');
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
            alert('Validation Error: Data contains invalid parameters.');
        }
    };

    const startEditing = (user) => {
        setEditingUserId(user.id);
        setEditUser({
            nombre: user.nombre || '',
            email: user.email || '',
            passwordHash: '',
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
        if (editUser.passwordHash.trim()) {
            payload.passwordHash = editUser.passwordHash.trim();
        }
        if (editUser.fotoPerfilUrl.trim()) {
            payload.fotoPerfilUrl = editUser.fotoPerfilUrl.trim();
        }
        if (editUser.rol && editUser.rol !== users.find(u => u.id === editingUserId)?.rol) {
            payload.rol = editUser.rol;
        }

        if (Object.keys(payload).length === 0) {
            alert('No changes detected.');
            return;
        }

        try {
            await userApi.update(editingUserId, payload);
            cancelEditing();
            fetchUsers();
        } catch (err) {
            alert('Update Error: Could not apply changes.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await userApi.delete(id);
            setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
            alert('Security protocol: Could not remove user.');
        }
    };

    const filteredUsers = useMemo(() => {
        const term = search.toLowerCase();
        return users.filter((user) =>
            user.nombre.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
        );
    }, [users, search]);

    return (
        <div className="container py-12">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold mb-2 tracking-widest text-sm uppercase">
                            <Users size={16} />
                            <span>Directory Control</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                            User <span className="text-accent-gradient">Management</span>
                        </h1>
                        <p className="text-text-dim text-lg max-w-xl leading-relaxed">
                            Manage authorized identities, profile metadata, and access credentials.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={fetchUsers} className="btn btn-ghost" title="Resync Directory">
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
                            {isAdding ? <X size={20} /> : <UserPlus size={20} />}
                            <span>{isAdding ? 'Abort' : 'New User'}</span>
                        </button>
                    </div>
                </div>

                <div className="relative mt-10">
                    <div className="absolute inset-y-0 left-4 flex items-center text-text-muted">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 py-4 bg-white/5 border-glass-border focus:bg-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </motion.header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -20 }}
                        className="overflow-hidden mb-16"
                    >
                        <form onSubmit={handleAdd} className="glass-card p-8 border-primary/20 bg-primary/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input
                                        required
                                        value={newUser.nombre}
                                        onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="user@domain.com"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Password Hash</label>
                                    <input
                                        required
                                        value={newUser.passwordHash}
                                        onChange={(e) => setNewUser({ ...newUser, passwordHash: e.target.value })}
                                        placeholder="hash value"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Role</label>
                                    <select
                                        value={newUser.rol}
                                        onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                                        className="bg-white/5 border-glass-border focus:bg-white/10 focus:border-primary"
                                    >
                                        <option value="usuario">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Profile Image URL</label>
                                    <input
                                        value={newUser.fotoPerfilUrl}
                                        onChange={(e) => setNewUser({ ...newUser, fotoPerfilUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="btn btn-primary px-10">
                                    <UserPlus size={20} />
                                    Authorize User
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingUserId != null && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -20 }}
                        className="overflow-hidden mb-16"
                    >
                        <form onSubmit={handleUpdate} className="glass-card p-8 border-accent/20 bg-accent/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Edit User</h2>
                                <button type="button" className="btn btn-ghost" onClick={cancelEditing}>
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input
                                        value={editUser.nombre}
                                        onChange={(e) => setEditUser({ ...editUser, nombre: e.target.value })}
                                        placeholder="Full name"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        placeholder="user@domain.com"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">New Password Hash</label>
                                    <input
                                        value={editUser.passwordHash}
                                        onChange={(e) => setEditUser({ ...editUser, passwordHash: e.target.value })}
                                        placeholder="leave blank to keep current"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Role</label>
                                    <select
                                        value={editUser.rol}
                                        onChange={(e) => setEditUser({ ...editUser, rol: e.target.value })}
                                        className="bg-white/5 border-glass-border focus:bg-white/10 focus:border-accent"
                                    >
                                        <option value="usuario">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Profile Image URL</label>
                                    <input
                                        value={editUser.fotoPerfilUrl}
                                        onChange={(e) => setEditUser({ ...editUser, fotoPerfilUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="btn btn-primary px-10">
                                    <Pencil size={18} />
                                    Apply Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                    <RefreshCw className="animate-spin text-primary mb-4" size={48} />
                    <p className="font-heading text-xl tracking-widest uppercase">Syncing Directory...</p>
                </div>
            ) : (
                <div className="grid-vault">
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.map((user, idx) => (
                            <motion.div
                                layout
                                key={user.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="glass-card p-6 flex flex-col group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white overflow-hidden">
                                        {user.fotoPerfilUrl ? (
                                            <img src={user.fotoPerfilUrl} alt={user.nombre} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users size={22} />
                                        )}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-mono tracking-tighter text-text-dim border border-glass-border">
                                        ID: {user.id.toString().padStart(4, '0')}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {user.nombre}
                                </h3>
                                <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                                    <Mail size={16} />
                                    <span className="text-sm tracking-wide">{user.email}</span>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-glass-border">
                                        <div className="text-text-muted text-xs uppercase font-bold tracking-widest">Role</div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            {user.rol === 'admin' ? (
                                                <>
                                                    <Shield size={16} className="text-danger" />
                                                    <span className="text-xs tracking-widest text-danger uppercase">Admin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck size={16} className="text-accent" />
                                                    <span className="text-xs tracking-widest text-accent uppercase">User</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-glass-border">
                                        <div className="text-text-muted text-xs uppercase font-bold tracking-widest">Credentials</div>
                                        <div className="flex items-center gap-2 text-accent font-semibold">
                                            <Key size={16} />
                                            <span className="text-xs tracking-[0.2em]">••••••••</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => startEditing(user)}
                                            className="btn btn-ghost flex-1"
                                        >
                                            <Pencil size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn btn-danger-dim flex-1"
                                        >
                                            <Trash2 size={18} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredUsers.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 glass-card border-dashed border-2 bg-transparent"
                >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                        <Search size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No matching users</h3>
                    <p className="text-text-dim">Try adjusting your search filters or add a new user.</p>
                </motion.div>
            )}

            {error && !loading && (
                <div className="fixed bottom-8 right-8 max-w-md">
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="p-4 bg-danger/10 border border-danger/20 rounded-xl backdrop-blur-md flex gap-4 text-danger"
                    >
                        <Info size={24} />
                        <div>
                            <p className="font-bold">System Alert</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
