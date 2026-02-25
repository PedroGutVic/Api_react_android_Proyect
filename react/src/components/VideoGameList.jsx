import { useEffect, useMemo, useState } from 'react';
import { videoGameApi } from '../api/client';
import { authService } from '../api/auth';
import StarRating from './stars';
import {
    Gamepad2,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Pencil,
    X,
    Star,
    Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyGame = {
    nombre: '',
    precio: '',
    plataforma: '',
    caracteristicas: '',
    puntuacion: 0,
};

const VideoGameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [activeId, setActiveId] = useState(null);
    const [formState, setFormState] = useState(emptyGame);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchGames();
        const user = authService.getUser();
        setUserRole(user?.role || null);
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await videoGameApi.getAll();
            setGames(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching games:', err);
            setGames([]);
            const msg = err.response?.status === 401 
                ? 'API requiere autenticacion. Configura tus credenciales o habilita acceso publico.' 
                : err.response?.data || 'No se pudo cargar el catalogo.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        if (userRole !== 'admin') return;
        setFormMode('add');
        setActiveId(null);
        setFormState(emptyGame);
        setFormOpen(true);
    };

    const openEdit = (game) => {
        if (userRole !== 'admin') return;
        setFormMode('edit');
        setActiveId(game.id);
        setFormState({
            nombre: game.nombre || '',
            precio: game.precio ?? '',
            plataforma: game.plataforma || '',
            caracteristicas: game.caracteristicas || '',
            puntuacion: game.puntuacion ?? 0,
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setFormMode('add');
        setActiveId(null);
        setFormState(emptyGame);
    };

    const handleDelete = async (id) => {
        if (userRole !== 'admin') return;
        try {
            await videoGameApi.delete(id);
            setGames((prev) => prev.filter((game) => game.id !== id));
        } catch (err) {
            alert('No se pudo eliminar el videojuego.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            ...formState,
            precio: Number.parseFloat(formState.precio),
            puntuacion: Number.parseInt(formState.puntuacion, 10) || 0,
        };

        try {
            if (formMode === 'add') {
                await videoGameApi.create({ ...payload, id: 0 });
            } else if (activeId != null) {
                await videoGameApi.update(activeId, payload);
            }
            closeForm();
            fetchGames();
        } catch (err) {
            alert('No se pudo guardar el videojuego.');
        }
    };

    const filteredGames = useMemo(() => {
        if (!Array.isArray(games)) return [];
        const term = search.toLowerCase();
        return games.filter(
            (game) =>
                (game?.nombre || '').toLowerCase().includes(term) ||
                (game?.plataforma || '').toLowerCase().includes(term)
        );
    }, [games, search]);

    return (
        <section id="juegos" className="section">
            <div className="wrap">
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Catalogo en vivo</p>
                        <h2 className="section-title">Videojuegos</h2>
                        <p className="section-desc">
                            Listado visual con herramientas para anadir, editar y eliminar juegos.
                        </p>
                    </div>
                    <div className="section-actions">
                        <button className="button button-outline" onClick={fetchGames}>
                            <RefreshCw size={18} /> Actualizar
                        </button>
                        {userRole === 'admin' && (
                            <button className="button button-primary" onClick={openAdd}>
                                <Plus size={18} /> Nuevo videojuego
                            </button>
                        )}
                    </div>
                </div>

                <div className="toolbar">
                    <div className="search">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Buscar por nombre o plataforma"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {formOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="panel form-panel"
                        >
                            <div className="panel-head">
                                <h3>{formMode === 'add' ? 'Nuevo videojuego' : 'Editar videojuego'}</h3>
                                <button type="button" className="button button-ghost" onClick={closeForm}>
                                    <X size={18} /> Cerrar
                                </button>
                            </div>
                            <form className="form-grid" onSubmit={handleSubmit}>
                                <label className="form-field">
                                    <span>Nombre</span>
                                    <input
                                        required
                                        value={formState.nombre}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, nombre: event.target.value }))
                                        }
                                        placeholder="Ej: Ocean Drift"
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Precio</span>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formState.precio}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, precio: event.target.value }))
                                        }
                                        placeholder="19.99"
                                    />
                                </label>
                                <label className="form-field">
                                    <span>Plataforma</span>
                                    <input
                                        required
                                        value={formState.plataforma}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, plataforma: event.target.value }))
                                        }
                                        placeholder="PC / Consola"
                                    />
                                </label>
                                <label className="form-field form-field-wide">
                                    <span>Descripcion breve</span>
                                    <textarea
                                        rows={3}
                                        value={formState.caracteristicas}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, caracteristicas: event.target.value }))
                                        }
                                        placeholder="Resumen del juego"
                                    />
                                </label>
                                <div className="rating-box">
                                    <div className="rating-title">
                                        <Star size={18} />
                                        <span>Puntuacion</span>
                                    </div>
                                    <StarRating
                                        initialRating={formState.puntuacion}
                                        onRate={(rating) =>
                                            setFormState((prev) => ({ ...prev, puntuacion: rating }))
                                        }
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="button button-primary">
                                        {formMode === 'add' ? 'Guardar videojuego' : 'Guardar cambios'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading && games.length === 0 ? (
                    <div className="empty-state">
                        <div className="loader" />
                        <p>Cargando catalogo...</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        <AnimatePresence mode="popLayout">
                            {filteredGames.map((game) => (
                                <motion.article
                                    layout
                                    key={game.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    className="card game-card"
                                >
                                    <div className="card-header">
                                        <div className="icon-chip">
                                            <Gamepad2 size={20} />
                                        </div>
                                        <span className="tag">ID {game.id}</span>
                                    </div>
                                    <h3>{game?.nombre || 'Sin nombre'}</h3>
                                    <p className="card-meta">{game?.plataforma || 'Sin plataforma'}</p>
                                    <p className="card-desc">{game?.caracteristicas || 'Sin descripcion.'}</p>
                                    <div className="card-info">
                                        <div>
                                            <span className="label">Precio</span>
                                            <p className="price">{(Number(game?.precio) || 0).toFixed(2)} EUR</p>
                                        </div>
                                        <div className="visits">
                                            <Eye size={16} /> {game?.visitas ?? 0}
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        {userRole === 'admin' && (
                                            <>
                                                <button className="button button-outline" onClick={() => openEdit(game)}>
                                                    <Pencil size={16} /> Editar
                                                </button>
                                                <button className="button button-ghost" onClick={() => handleDelete(game.id)}>
                                                    <Trash2 size={16} /> Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredGames.length === 0 && (
                    <div className="empty-state">
                        <p>No hay videojuegos con esos filtros.</p>
                    </div>
                )}

                {error && !loading && <div className="message message-error">{error}</div>}
            </div>
        </section>
    );
};

export default VideoGameList;
