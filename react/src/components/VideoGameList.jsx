
import { useCallback, useEffect, useMemo, useState } from 'react';
import { videoGameApi } from '../api/client';
import { authService } from '../api/auth';
import StarRating from './stars';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import useDebounce from '../hooks/useDebounce';
import useEscapeKey from '../hooks/useEscapeKey';
import { SkeletonCard, SkeletonRow } from './Skeleton';
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
    TrendingUp,
    Heart,
    DollarSign,
    Award,
    Sparkles,
    LayoutGrid,
    List,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const getGameCoverUrl = (imagenUrl = '') => {
    return imagenUrl || 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop';
};

const GENEROS = ['RPG', 'Acción', 'Aventura', 'Plataformas', 'FPS', 'Estrategia', 'Simulación', 'Deportes', 'Lucha', 'Terror', 'Puzzle', 'Roguelike', 'MMORPG', 'Indie', 'Multijugador'];

const emptyGame = {
    nombre: '',
    precio: '',
    plataforma: '',
    caracteristicas: '',
    puntuacion: 0,
    imagen_url: '',
    anio_lanzamiento: '',
    genero: '',
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
    const [currentUser, setCurrentUser] = useState(null);
    const [detailGame, setDetailGame] = useState(null);
    const [myRating, setMyRating] = useState(0);

    const [platformFilter, setPlatformFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [favorites, setFavorites] = useState([]);
    const [showFavsOnly, setShowFavsOnly] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 20;

    const showToast = useToast();
    const confirm = useConfirm();
    const debouncedSearch = useDebounce(search, 200);

    const handleEscape = useCallback(() => {
        if (detailGame) { setDetailGame(null); return; }
        if (formOpen)   { closeForm(); }
    }, [detailGame, formOpen]);
    useEscapeKey(handleEscape);

    useEffect(() => { setPage(0); }, [debouncedSearch, platformFilter, sortBy, showFavsOnly]);

    useEffect(() => {
        fetchGames();
        const user = authService.getUser();
        setCurrentUser(user);
        setUserRole(user?.role || null);
        
        const userId = user?.id || 'guest';
        const savedFavs = localStorage.getItem(`favs_${userId}`);
        if (savedFavs) {
            setFavorites(JSON.parse(savedFavs));
        }
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
            imagen_url: game.imagenUrl || game.imagen_url || '',
            anio_lanzamiento: game.anioLanzamiento || game.anio_lanzamiento || '',
            genero: game.genero || '',
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
        const ok = await confirm('¿Estás seguro de que deseas eliminar este videojuego del catálogo?');
        if (!ok) return;
        try {
            await videoGameApi.delete(id);
            setGames((prev) => prev.filter((game) => game.id !== id));
            showToast('Videojuego eliminado del catálogo.', 'success');
        } catch (err) {
            showToast('No se pudo eliminar el videojuego.', 'error');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            ...formState,
            precio: Number.parseFloat(formState.precio),
            puntuacion: Number.parseInt(formState.puntuacion, 10) || 0,
            imagen_url: formState.imagen_url?.trim() || null,
            anio_lanzamiento: formState.anio_lanzamiento ? Number.parseInt(formState.anio_lanzamiento, 10) : null,
            genero: formState.genero?.trim() || null,
        };

        try {
            if (formMode === 'add') {
                await videoGameApi.create({ ...payload, id: 0 });
                showToast('Videojuego añadido al catálogo.', 'success');
            } else if (activeId != null) {
                await videoGameApi.update(activeId, payload);
                showToast('Videojuego actualizado correctamente.', 'success');
            }
            closeForm();
            fetchGames();
        } catch (err) {
            showToast('No se pudo guardar el videojuego.', 'error');
        }
    };

    const openDetail = async (game) => {
        const updated = { ...game, visitas: (game.visitas ?? 0) + 1 };
        setDetailGame(updated);
        setMyRating(0);
        setGames((prev) => prev.map((g) => (g.id === game.id ? updated : g)));
        try {
            await videoGameApi.incrementVisit(game.id);
        } catch {}
        try {
            const res = await videoGameApi.getMyRating(game.id);
            setMyRating(res.data.rating ?? 0);
        } catch {}
    };

    const handleRate = async (rating) => {
        if (!detailGame) return;
        try {
            const res = await videoGameApi.rateGame(detailGame.id, rating);
            const newAvg = res.data.newAverage;
            setMyRating(rating);
            setDetailGame((prev) => ({ ...prev, puntuacion: newAvg }));
            setGames((prev) =>
                prev.map((g) => (g.id === detailGame.id ? { ...g, puntuacion: newAvg } : g))
            );
        } catch {}
    };

    const toggleFavorite = (gameId) => {
        const userId = currentUser?.id || 'guest';
        let updated;
        if (favorites.includes(gameId)) {
            updated = favorites.filter((id) => id !== gameId);
        } else {
            updated = [...favorites, gameId];
        }
        setFavorites(updated);
        localStorage.setItem(`favs_${userId}`, JSON.stringify(updated));
    };

    const stats = useMemo(() => {
        if (!Array.isArray(games) || games.length === 0) {
            return { count: 0, avgRating: '0.0', totalValue: '0.00', mostPopular: 'N/A' };
        }

        const count = games.length;
        const sumRating = games.reduce((acc, g) => acc + (g.puntuacion || 0), 0);
        const avgRating = (sumRating / count).toFixed(1);
        const sumPrice = games.reduce((acc, g) => acc + (Number(g.precio) || 0), 0);
        const totalValue = sumPrice.toFixed(2);
        const sortedByVisits = [...games].sort((a, b) => (b.visitas || 0) - (a.visitas || 0));
        const mostPopular = sortedByVisits[0]?.nombre || 'Ninguno';

        return { count, avgRating, totalValue, mostPopular };
    }, [games]);

    const filteredAndSortedGames = useMemo(() => {
        if (!Array.isArray(games)) return [];
        let result = [...games];

        const term = debouncedSearch.toLowerCase();
        if (term) {
            result = result.filter(
                (game) =>
                    (game?.nombre || '').toLowerCase().includes(term) ||
                    (game?.plataforma || '').toLowerCase().includes(term)
            );
        }

        if (platformFilter !== 'all') {
            result = result.filter((game) => {
                const plat = (game?.plataforma || '').toLowerCase();
                const filter = platformFilter.toLowerCase();
                if (filter === 'nintendo') return plat.includes('switch') || plat.includes('nintendo');
                if (filter === 'playstation') return plat.includes('ps') || plat.includes('playstation');
                if (filter === 'xbox') return plat.includes('xbox');
                if (filter === 'pc') return plat.includes('pc');
                return plat.includes(filter);
            });
        }

        if (showFavsOnly) {
            result = result.filter((game) => favorites.includes(game.id));
        }

        if (sortBy === 'price-asc') {
            result.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
        } else if (sortBy === 'rating-desc') {
            result.sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0));
        } else if (sortBy === 'visits-desc') {
            result.sort((a, b) => (b.visitas || 0) - (a.visitas || 0));
        } else if (sortBy === 'name-asc') {
            result.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        }

        return result;
    }, [games, debouncedSearch, platformFilter, sortBy, favorites, showFavsOnly]);

    const totalPages = Math.ceil(filteredAndSortedGames.length / PAGE_SIZE);
    const pagedGames = filteredAndSortedGames.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <section id="juegos" className="section">
            <div className="wrap">
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Catálogo en vivo</p>
                        <h2 className="section-title">Navega por el Vault</h2>
                        <p className="section-desc">
                            Explora estadísticas en tiempo real, añade favoritos y gestiona tus videojuegos.
                        </p>
                    </div>
                    <div className="section-actions">
                        <button className="button button-outline" onClick={fetchGames} title="Actualizar Datos">
                            <RefreshCw size={16} /> Actualizar
                        </button>
                        {userRole === 'admin' && (
                            <button className="button button-primary" onClick={openAdd}>
                                <Plus size={16} /> Nuevo videojuego
                            </button>
                        )}
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="dashboard-icon">
                            <Gamepad2 size={24} />
                        </div>
                        <div className="dashboard-info">
                            <span className="label">Total Juegos</span>
                            <span className="dashboard-num">{stats.count}</span>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-icon" style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)' }}>
                            <Award size={24} />
                        </div>
                        <div className="dashboard-info">
                            <span className="label">Valoración Media</span>
                            <span className="dashboard-num">★ {stats.avgRating}</span>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-icon" style={{ color: '#ff6f43', background: 'rgba(255,111,67,0.08)' }}>
                            <DollarSign size={24} />
                        </div>
                        <div className="dashboard-info">
                            <span className="label">Valor de Biblioteca</span>
                            <span className="dashboard-num">{stats.totalValue} €</span>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-icon" style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.08)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className="dashboard-info">
                            <span className="label">Más Popular</span>
                            <span className="dashboard-num" style={{ fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }} title={stats.mostPopular}>
                                {stats.mostPopular}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="toolbar">
                    <div className="search">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Buscar por nombre o plataforma..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    
                    <div className="sort-box">
                        <button
                            className={`platform-filter-btn ${showFavsOnly ? 'active' : ''}`}
                            onClick={() => setShowFavsOnly(!showFavsOnly)}
                            style={{ border: showFavsOnly ? '1px solid #ef4444' : '1px solid var(--line)', background: showFavsOnly ? 'rgba(239, 68, 68, 0.08)' : 'var(--surface)', color: showFavsOnly ? '#ef4444' : 'var(--ink)' }}
                        >
                            <Heart size={14} fill={showFavsOnly ? "#ef4444" : "none"} /> Favoritos ({favorites.length})
                        </button>

                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                        >
                            <option value="default">Recomendados</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                            <option value="rating-desc">Mejores Valorados</option>
                            <option value="visits-desc">Más Populares (Visitas)</option>
                            <option value="name-asc">Nombre (A-Z)</option>
                        </select>

                        <div className="view-toggle">
                            <button
                                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Vista cuadrícula"
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                title="Vista lista"
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="platform-filters">
                    <button
                        className={`platform-filter-btn ${platformFilter === 'all' ? 'active' : ''}`}
                        data-platform="all"
                        onClick={() => setPlatformFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`platform-filter-btn ${platformFilter === 'nintendo' ? 'active' : ''}`}
                        data-platform="nintendo"
                        onClick={() => setPlatformFilter('nintendo')}
                    >
                        🎮 Nintendo Switch
                    </button>
                    <button
                        className={`platform-filter-btn ${platformFilter === 'playstation' ? 'active' : ''}`}
                        data-platform="playstation"
                        onClick={() => setPlatformFilter('playstation')}
                    >
                        🔵 PlayStation
                    </button>
                    <button
                        className={`platform-filter-btn ${platformFilter === 'xbox' ? 'active' : ''}`}
                        data-platform="xbox"
                        onClick={() => setPlatformFilter('xbox')}
                    >
                        🟢 Xbox
                    </button>
                    <button
                        className={`platform-filter-btn ${platformFilter === 'pc' ? 'active' : ''}`}
                        data-platform="pc"
                        onClick={() => setPlatformFilter('pc')}
                    >
                        💻 PC Master Race
                    </button>
                </div>

                {/* Modal Crear / Editar */}
                <AnimatePresence>
                    {formOpen && (
                        <div className="modal-overlay" onClick={closeForm}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                                transition={{ duration: 0.25 }}
                                className="modal-content"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h3 style={{ fontFamily: 'Fraunces', fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sparkles size={20} style={{ color: 'var(--teal)' }} />
                                        {formMode === 'add' ? 'Nuevo Videojuego' : 'Editar Videojuego'}
                                    </h3>
                                    <button type="button" className="theme-toggle" onClick={closeForm}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className="form" onSubmit={handleSubmit}>
                                        <div className="form-grid">
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
                                                <span>Precio (€)</span>
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
                                                <span>Año de lanzamiento</span>
                                                <input
                                                    type="number"
                                                    min="1970"
                                                    max={new Date().getFullYear() + 2}
                                                    value={formState.anio_lanzamiento}
                                                    onChange={(event) =>
                                                        setFormState((prev) => ({ ...prev, anio_lanzamiento: event.target.value }))
                                                    }
                                                    placeholder="2024"
                                                />
                                            </label>
                                            <label className="form-field">
                                                <span>Plataforma</span>
                                                <select
                                                    required
                                                    value={formState.plataforma}
                                                    onChange={(event) =>
                                                        setFormState((prev) => ({ ...prev, plataforma: event.target.value }))
                                                    }
                                                >
                                                    <option value="">Selecciona plataforma...</option>
                                                    <option value="PC">PC</option>
                                                    <option value="Nintendo Switch">Nintendo Switch</option>
                                                    <option value="PS5">PlayStation 5</option>
                                                    <option value="Xbox Series">Xbox Series X/S</option>
                                                    <option value="Multiplataforma">Multiplataforma</option>
                                                </select>
                                            </label>
                                            <label className="form-field">
                                                <span>Género</span>
                                                <select
                                                    value={formState.genero}
                                                    onChange={(event) =>
                                                        setFormState((prev) => ({ ...prev, genero: event.target.value }))
                                                    }
                                                >
                                                    <option value="">Sin género</option>
                                                    {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </label>
                                        </div>
                                        <label className="form-field">
                                            <span>Descripción breve</span>
                                            <textarea
                                                rows={3}
                                                value={formState.caracteristicas}
                                                onChange={(event) =>
                                                    setFormState((prev) => ({ ...prev, caracteristicas: event.target.value }))
                                                }
                                                placeholder="Resumen del juego, mecánicas, etc..."
                                            />
                                        </label>

                                        <div className="form-cover-row">
                                            <label className="form-field" style={{ flex: 1 }}>
                                                <span>URL de portada</span>
                                                <input
                                                    type="url"
                                                    value={formState.imagen_url}
                                                    onChange={(event) =>
                                                        setFormState((prev) => ({ ...prev, imagen_url: event.target.value }))
                                                    }
                                                    placeholder="https://..."
                                                />
                                            </label>
                                            {formState.imagen_url && (
                                                <div className="form-cover-preview">
                                                    <img
                                                        src={formState.imagen_url}
                                                        alt="preview"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="rating-box" style={{ background: 'var(--surface-alt)' }}>
                                            <div className="rating-title">
                                                <Star size={16} fill="var(--muted)" />
                                                <span>Puntuación</span>
                                            </div>
                                            <StarRating
                                                initialRating={formState.puntuacion}
                                                onRate={(rating) =>
                                                    setFormState((prev) => ({ ...prev, puntuacion: rating }))
                                                }
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="button" className="button button-ghost" onClick={closeForm}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="button button-primary">
                                                {formMode === 'add' ? 'Guardar Videojuego' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Modal Detalle */}
                <AnimatePresence>
                    {detailGame && (
                        <div className="modal-overlay" onClick={() => setDetailGame(null)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                transition={{ duration: 0.25 }}
                                className="modal-content modal-detail"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-detail-banner">
                                    <img
                                        src={getGameCoverUrl(detailGame.imagenUrl)}
                                        alt={detailGame.nombre}
                                        onError={(e) => { e.currentTarget.src = getGameCoverUrl(); }}
                                    />
                                    <div className="modal-detail-banner-overlay">
                                        <h2 className="modal-detail-title">{detailGame.nombre}</h2>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span
                                                className="brand-badge"
                                                data-platform={detailGame.plataforma?.toLowerCase()}
                                            >
                                                {detailGame.plataforma || 'N/A'}
                                            </span>
                                            {detailGame.genero && (
                                                <span className="genre-badge">{detailGame.genero}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="modal-detail-close theme-toggle"
                                        onClick={() => setDetailGame(null)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="modal-detail-body">
                                    <div className="modal-detail-stats">
                                        <div className="modal-detail-stat">
                                            <span className="label">Valoración media</span>
                                            <div className="rating-stars" style={{ marginTop: '4px' }}>
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <Star
                                                        key={idx}
                                                        size={18}
                                                        fill={idx < Math.round(detailGame.puntuacion || 0) ? '#fbbf24' : 'none'}
                                                        stroke="#fbbf24"
                                                    />
                                                ))}
                                                <span style={{ fontSize: '14px', color: 'var(--muted)', marginLeft: '6px', fontWeight: '700' }}>
                                                    {(detailGame.puntuacion || 0).toFixed(1)}/5
                                                </span>
                                            </div>
                                            {currentUser && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <span className="label" style={{ display: 'block', marginBottom: '6px' }}>Tu valoración</span>
                                                    <StarRating
                                                        key={myRating}
                                                        initialRating={myRating}
                                                        onRate={handleRate}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="modal-detail-stat">
                                            <span className="label">Precio</span>
                                            <span className="price" style={{ fontSize: '26px' }}>
                                                {(Number(detailGame.precio) || 0).toFixed(2)} €
                                            </span>
                                        </div>
                                        <div className="modal-detail-stat">
                                            <span className="label">Visitas</span>
                                            <span style={{ fontWeight: '700', fontSize: '22px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Eye size={18} style={{ color: 'var(--muted)' }} />
                                                {detailGame.visitas ?? 0}
                                            </span>
                                        </div>
                                        {(detailGame.anioLanzamiento || detailGame.anio_lanzamiento) && (
                                            <div className="modal-detail-stat">
                                                <span className="label">Año</span>
                                                <span style={{ fontWeight: '700', fontSize: '22px', color: 'var(--ink)' }}>
                                                    {detailGame.anioLanzamiento || detailGame.anio_lanzamiento}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-detail-section">
                                        <p className="modal-detail-section-label">Descripción</p>
                                        <p className="modal-detail-desc">
                                            {detailGame.caracteristicas || 'Sin descripción disponible para este título.'}
                                        </p>
                                    </div>

                                    <div className="modal-detail-actions">
                                        <button
                                            className={`button ${favorites.includes(detailGame.id) ? 'button-outline' : 'button-ghost'}`}
                                            style={favorites.includes(detailGame.id) ? { borderColor: '#ef4444', color: '#ef4444' } : {}}
                                            onClick={() => toggleFavorite(detailGame.id)}
                                        >
                                            <Heart
                                                size={16}
                                                fill={favorites.includes(detailGame.id) ? '#ef4444' : 'none'}
                                                stroke={favorites.includes(detailGame.id) ? '#ef4444' : 'currentColor'}
                                            />
                                            {favorites.includes(detailGame.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                        </button>

                                        {userRole === 'admin' && (
                                            <>
                                                <button
                                                    className="button button-outline"
                                                    onClick={() => { setDetailGame(null); openEdit(detailGame); }}
                                                >
                                                    <Pencil size={14} /> Editar
                                                </button>
                                                <button
                                                    className="button button-ghost"
                                                    style={{ color: '#ef4444' }}
                                                    onClick={() => { setDetailGame(null); handleDelete(detailGame.id); }}
                                                >
                                                    <Trash2 size={14} /> Borrar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Contador de resultados */}
                {!loading && (
                    <div className="results-bar">
                        <span className="results-count">
                            {filteredAndSortedGames.length === games.length
                                ? `${games.length} juegos en el catálogo`
                                : `${filteredAndSortedGames.length} de ${games.length} juegos`}
                        </span>
                        {(debouncedSearch || platformFilter !== 'all' || showFavsOnly) && (
                            <button
                                className="button button-ghost"
                                style={{ fontSize: 12, padding: '4px 12px' }}
                                onClick={() => {
                                    setSearch('');
                                    setPlatformFilter('all');
                                    setShowFavsOnly(false);
                                }}
                            >
                                <X size={12} /> Limpiar filtros
                            </button>
                        )}
                    </div>
                )}

                {/* Grid / Lista del Catálogo */}
                {loading && games.length === 0 ? (
                    viewMode === 'grid' ? (
                        <div className="card-grid">
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <div className="list-view">
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
                        </div>
                    )
                ) : viewMode === 'grid' ? (
                    <div className="card-grid">
                        <AnimatePresence mode="popLayout">
                            {pagedGames.map((game) => {
                                const isFav = favorites.includes(game.id);
                                return (
                                    <motion.article
                                        layout
                                        key={game.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="card card-clickable"
                                        onClick={() => openDetail(game)}
                                    >
                                        <div className="card-banner">
                                            <img
                                                src={getGameCoverUrl(game.imagenUrl)}
                                                alt={game.nombre}
                                                loading="lazy"
                                                onError={(e) => { e.currentTarget.src = getGameCoverUrl(); }}
                                            />
                                            <div className="card-banner-overlay">
                                                <h3 className="card-banner-title">{game.nombre}</h3>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="card-header">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                    <span
                                                        className="brand-badge"
                                                        data-platform={game.plataforma?.toLowerCase()}
                                                    >
                                                        {game.plataforma || 'N/A'}
                                                    </span>
                                                    {(game.anioLanzamiento || game.anio_lanzamiento) && (
                                                        <span className="year-badge">
                                                            {game.anioLanzamiento || game.anio_lanzamiento}
                                                        </span>
                                                    )}
                                                    {game.genero && (
                                                        <span className="genre-badge">{game.genero}</span>
                                                    )}
                                                </div>
                                                <button
                                                    className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }}
                                                    title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                                                >
                                                    <Heart size={20} fill={isFav ? "#ef4444" : "none"} />
                                                </button>
                                            </div>

                                            <p className="card-desc">
                                                {game.caracteristicas || 'Sin descripción disponible.'}
                                            </p>

                                            <div className="rating-stars">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <Star
                                                        key={idx}
                                                        size={14}
                                                        fill={idx < Math.round(game.puntuacion || 0) ? "#fbbf24" : "none"}
                                                        stroke="#fbbf24"
                                                    />
                                                ))}
                                                <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '6px', fontWeight: '700' }}>
                                                    ({(game.puntuacion || 0).toFixed(1)}/5)
                                                </span>
                                            </div>

                                            <div className="card-info">
                                                <div className="price-box">
                                                    <span className="label">Precio</span>
                                                    <span className="price">{(Number(game.precio) || 0).toFixed(2)} €</span>
                                                </div>
                                                <div className="visits">
                                                    <Eye size={16} style={{ marginRight: '4px' }} /> {game.visitas ?? 0}
                                                </div>
                                            </div>

                                            {userRole === 'admin' && (
                                                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button className="button button-outline" onClick={() => openEdit(game)}>
                                                        <Pencil size={14} /> Editar
                                                    </button>
                                                    <button
                                                        className="button button-ghost"
                                                        style={{ color: '#ef4444' }}
                                                        onClick={() => handleDelete(game.id)}
                                                    >
                                                        <Trash2 size={14} /> Borrar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="list-view">
                        <AnimatePresence mode="popLayout">
                            {pagedGames.map((game) => {
                                const isFav = favorites.includes(game.id);
                                return (
                                    <motion.article
                                        layout
                                        key={game.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -12 }}
                                        transition={{ duration: 0.22 }}
                                        className="list-row"
                                        onClick={() => openDetail(game)}
                                    >
                                        <img
                                            className="list-row-thumb"
                                            src={getGameCoverUrl(game.imagenUrl)}
                                            alt={game.nombre}
                                            loading="lazy"
                                            onError={(e) => { e.currentTarget.src = getGameCoverUrl(); }}
                                        />
                                        <div className="list-row-main">
                                            <span className="list-row-name">{game.nombre}</span>
                                            <span
                                                className="brand-badge"
                                                data-platform={game.plataforma?.toLowerCase()}
                                                style={{ alignSelf: 'flex-start' }}
                                            >
                                                {game.plataforma || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="list-row-rating">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <Star
                                                    key={idx}
                                                    size={13}
                                                    fill={idx < Math.round(game.puntuacion || 0) ? "#fbbf24" : "none"}
                                                    stroke="#fbbf24"
                                                />
                                            ))}
                                            <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '4px', fontWeight: 700 }}>
                                                {(game.puntuacion || 0).toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="list-row-visits">
                                            <Eye size={14} /> {game.visitas ?? 0}
                                        </div>
                                        <span className="list-row-price">{(Number(game.precio) || 0).toFixed(2)} €</span>
                                        <div className="list-row-actions" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className={`favorite-btn ${isFav ? 'active' : ''}`}
                                                onClick={() => toggleFavorite(game.id)}
                                                title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                                            >
                                                <Heart size={17} fill={isFav ? "#ef4444" : "none"} />
                                            </button>
                                            {userRole === 'admin' && (
                                                <>
                                                    <button className="button button-outline" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => openEdit(game)}>
                                                        <Pencil size={13} /> Editar
                                                    </button>
                                                    <button className="button button-ghost" style={{ padding: '6px 12px', fontSize: 13, color: '#ef4444' }} onClick={() => handleDelete(game.id)}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Paginación */}
                {!loading && totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={page === 0}
                            onClick={() => { setPage(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >«</button>
                        <button
                            className="pagination-btn"
                            disabled={page === 0}
                            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >‹</button>

                        {Array.from({ length: totalPages }, (_, i) => i)
                            .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
                            .reduce((acc, i, idx, arr) => {
                                if (idx > 0 && i - arr[idx - 1] > 1) acc.push('…');
                                acc.push(i);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                item === '…'
                                    ? <span key={`e${idx}`} className="pagination-ellipsis">…</span>
                                    : <button
                                        key={item}
                                        className={`pagination-btn ${item === page ? 'active' : ''}`}
                                        onClick={() => { setPage(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    >{item + 1}</button>
                            )}

                        <button
                            className="pagination-btn"
                            disabled={page === totalPages - 1}
                            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >›</button>
                        <button
                            className="pagination-btn"
                            disabled={page === totalPages - 1}
                            onClick={() => { setPage(totalPages - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >»</button>
                    </div>
                )}

                {!loading && filteredAndSortedGames.length === 0 && (
                    showFavsOnly ? (
                        <div className="empty-state">
                            <Heart size={48} style={{ color: '#ef4444', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>Sin favoritos todavía</h3>
                            <p style={{ maxWidth: '300px' }}>
                                Pulsa el corazón en cualquier juego para guardarlo aquí.
                            </p>
                            <button
                                className="button button-outline"
                                onClick={() => setShowFavsOnly(false)}
                            >
                                Ver todos los juegos
                            </button>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Gamepad2 size={48} style={{ color: 'var(--muted)', opacity: 0.6 }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>No se encontraron juegos</h3>
                            <p style={{ maxWidth: '300px' }}>
                                Prueba ajustando tus términos de búsqueda o filtros de plataforma.
                            </p>
                            {(debouncedSearch || platformFilter !== 'all') && (
                                <button
                                    className="button button-outline"
                                    onClick={() => { setSearch(''); setPlatformFilter('all'); }}
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    )
                )}

                {error && !loading && <div className="message message-error">{error}</div>}
            </div>
        </section>
    );
};

export default VideoGameList;
