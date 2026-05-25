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
    TrendingUp,
    Heart,
    DollarSign,
    Award,
    Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Resolutor dinámico de portadas para dar un look premium y evitar placeholders
const getGameCoverUrl = (nombre = '', plataforma = '') => {
    const name = nombre.toLowerCase();
    
    if (name.includes('zelda') || name.includes('breath of the wild') || name.includes('link')) {
        return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('ragnarok') || name.includes('god of war') || name.includes('kratos')) {
        return 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('elden ring') || name.includes('souls') || name.includes('bloodborne')) {
        return 'https://images.unsplash.com/photo-1655821888788-6107699e173b?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('halo') || name.includes('master chief')) {
        return 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('hades')) {
        return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('celeste') || name.includes('mountain')) {
        return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('mario') || name.includes('kart') || name.includes('odyssey') || name.includes('nintendo')) {
        return 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('cyberpunk') || name.includes('witcher')) {
        return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';
    }
    if (name.includes('minecraft')) {
        return 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=600&auto=format&fit=crop';
    }
    
    // Fallbacks por plataforma
    const plat = plataforma.toLowerCase();
    if (plat.includes('switch') || plat.includes('nintendo')) {
        return 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=600&auto=format&fit=crop';
    }
    if (plat.includes('ps') || plat.includes('playstation') || plat.includes('ps5')) {
        return 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop';
    }
    if (plat.includes('xbox')) {
        return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop';
    }
    
    // Fallback general
    return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop';
};

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
    const [currentUser, setCurrentUser] = useState(null);
    const [detailGame, setDetailGame] = useState(null);

    // Nuevos estados para filtros, ordenamiento y favoritos
    const [platformFilter, setPlatformFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [favorites, setFavorites] = useState([]);
    const [showFavsOnly, setShowFavsOnly] = useState(false);

    useEffect(() => {
        fetchGames();
        const user = authService.getUser();
        setCurrentUser(user);
        setUserRole(user?.role || null);
        
        // Cargar favoritos guardados localmente para el usuario actual
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
        if (!confirm('¿Estás seguro de que deseas eliminar este videojuego del catálogo?')) return;
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

    const openDetail = async (game) => {
        const updated = { ...game, visitas: (game.visitas ?? 0) + 1 };
        setDetailGame(updated);
        setGames((prev) =>
            prev.map((g) => (g.id === game.id ? updated : g))
        );
        try {
            await videoGameApi.incrementVisit(game.id);
        } catch {
            // silent: la visita optimista ya se mostró
        }
    };

    // Alternar favoritos localmente
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

    // Cálculos para el Dashboard de estadísticas
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

    // Filtrado y Ordenamiento inteligente combinado
    const filteredAndSortedGames = useMemo(() => {
        if (!Array.isArray(games)) return [];
        let result = [...games];

        // 1. Filtrado por término de búsqueda
        const term = search.toLowerCase();
        if (term) {
            result = result.filter(
                (game) =>
                    (game?.nombre || '').toLowerCase().includes(term) ||
                    (game?.plataforma || '').toLowerCase().includes(term)
            );
        }

        // 2. Filtrado por plataforma específica
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

        // 3. Filtrado por Favoritos
        if (showFavsOnly) {
            result = result.filter((game) => favorites.includes(game.id));
        }

        // 4. Ordenamiento
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
    }, [games, search, platformFilter, sortBy, favorites, showFavsOnly]);

    return (
        <section id="juegos" className="section">
            <div className="wrap">
                {/* Cabecera de la sección */}
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

                {/* Dashboard de Estadísticas */}
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

                {/* Barra de herramientas de filtros y búsqueda */}
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
                    </div>
                </div>

                {/* Filtros Rápidos por Consolas */}
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

                {/* Modal de Crear / Editar Videojuego */}
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

                {/* Modal de Detalle del Juego */}
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
                                {/* Portada grande */}
                                <div className="modal-detail-banner">
                                    <img
                                        src={getGameCoverUrl(detailGame.nombre, detailGame.plataforma)}
                                        alt={detailGame.nombre}
                                    />
                                    <div className="modal-detail-banner-overlay">
                                        <h2 className="modal-detail-title">{detailGame.nombre}</h2>
                                        <span
                                            className="brand-badge"
                                            data-platform={detailGame.plataforma?.toLowerCase()}
                                        >
                                            {detailGame.plataforma || 'N/A'}
                                        </span>
                                    </div>
                                    <button
                                        className="modal-detail-close theme-toggle"
                                        onClick={() => setDetailGame(null)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Cuerpo del detalle */}
                                <div className="modal-detail-body">
                                    {/* Fila superior: valoración + precio + visitas */}
                                    <div className="modal-detail-stats">
                                        <div className="modal-detail-stat">
                                            <span className="label">Valoración</span>
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
                                                    {detailGame.puntuacion || 0}/5
                                                </span>
                                            </div>
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
                                    </div>

                                    {/* Descripción */}
                                    <div className="modal-detail-section">
                                        <p className="modal-detail-section-label">Descripción</p>
                                        <p className="modal-detail-desc">
                                            {detailGame.caracteristicas || 'Sin descripción disponible para este título.'}
                                        </p>
                                    </div>

                                    {/* Acciones */}
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

                {/* Grid del Catálogo */}
                {loading && games.length === 0 ? (
                    <div className="empty-state" style={{ height: '350px' }}>
                        <div className="loader" />
                        <p style={{ fontWeight: '600' }}>Cargando catálogo premium...</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        <AnimatePresence mode="popLayout">
                            {filteredAndSortedGames.map((game) => {
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
                                        {/* Portada premium */}
                                        <div className="card-banner">
                                            <img 
                                                src={getGameCoverUrl(game.nombre, game.plataforma)} 
                                                alt={game.nombre} 
                                                loading="lazy"
                                            />
                                            <div className="card-banner-overlay">
                                                <h3 className="card-banner-title">{game.nombre}</h3>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="card-header">
                                                <span 
                                                    className="brand-badge"
                                                    data-platform={game.plataforma?.toLowerCase()}
                                                >
                                                    {game.plataforma || 'N/A'}
                                                </span>
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

                                            {/* Valoración dorada */}
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
                                                    ({game.puntuacion || 0}/5)
                                                </span>
                                            </div>

                                            {/* Sección inferior con precio e interacciones */}
                                            <div className="card-info">
                                                <div className="price-box">
                                                    <span className="label">Precio</span>
                                                    <span className="price">{(Number(game.precio) || 0).toFixed(2)} €</span>
                                                </div>
                                                <div className="visits">
                                                    <Eye size={16} style={{ marginRight: '4px' }} /> {game.visitas ?? 0}
                                                </div>
                                            </div>

                                            {/* Acciones de administración */}
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
                )}

                {/* Estado vacío */}
                {!loading && filteredAndSortedGames.length === 0 && (
                    <div className="empty-state">
                        <Gamepad2 size={48} style={{ color: 'var(--muted)', opacity: 0.6 }} />
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>No se encontraron juegos</h3>
                        <p style={{ maxWidth: '300px' }}>
                            Prueba ajustando tus términos de búsqueda o filtros de plataforma.
                        </p>
                    </div>
                )}

                {error && !loading && <div className="message message-error">{error}</div>}
            </div>
        </section>
    );
};

export default VideoGameList;
