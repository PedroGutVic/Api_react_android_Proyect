
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

const GAME_COVERS = {
    // RPG
    'elden ring': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    "baldur's gate 3": 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
    'the witcher 3: wild hunt': 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    'cyberpunk 2077': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    'skyrim special edition': 'https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg',
    'mass effect legendary edition': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1328670/header.jpg',
    'fallout 4': 'https://cdn.cloudflare.steamstatic.com/steam/apps/377160/header.jpg',
    'persona 5 royal': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg',
    'final fantasy vii remake': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/header.jpg',
    'final fantasy xvi': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/header.jpg',
    'disco elysium': 'https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg',
    'diablo iv': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2399830/header.jpg',
    'path of exile': 'https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg',
    // Accion/Aventura
    'god of war': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg',
    'god of war: ragnarok': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg',
    'red dead redemption 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    'grand theft auto v': 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    'spider-man remastered': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg',
    'spider-man: miles morales': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1976870/header.jpg',
    'ghost of tsushima': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg',
    'death stranding': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg',
    'horizon zero dawn': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg',
    'batman: arkham knight': 'https://cdn.cloudflare.steamstatic.com/steam/apps/208650/header.jpg',
    'the last of us part i': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg',
    'alan wake 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1903850/header.jpg',
    'control': 'https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg',
    'deathloop': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1252330/header.jpg',
    'ghostwire: tokyo': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1475810/header.jpg',
    // Souls-like
    'sekiro: shadows die twice': 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
    'dark souls iii': 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg',
    'dark souls: remastered': 'https://cdn.cloudflare.steamstatic.com/steam/apps/570940/header.jpg',
    'nioh 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1325200/header.jpg',
    'lies of p': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg',
    // FPS
    'doom eternal': 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg',
    'doom (2016)': 'https://cdn.cloudflare.steamstatic.com/steam/apps/379720/header.jpg',
    'counter-strike 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    'half-life: alyx': 'https://cdn.cloudflare.steamstatic.com/steam/apps/546560/header.jpg',
    'apex legends': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    'wolfenstein ii: the new colossus': 'https://cdn.cloudflare.steamstatic.com/steam/apps/612880/header.jpg',
    // Lucha
    'street fighter 6': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg',
    'tekken 8': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg',
    'mortal kombat 11': 'https://cdn.cloudflare.steamstatic.com/steam/apps/976310/header.jpg',
    // Plataformas/Indie
    'hollow knight': 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg',
    'celeste': 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg',
    'cuphead': 'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg',
    'ori and the will of the wisps': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg',
    'ori and the blind forest': 'https://cdn.cloudflare.steamstatic.com/steam/apps/261570/header.jpg',
    'sifu': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1468240/header.jpg',
    'ghostrunner': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1299610/header.jpg',
    'katana zero': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1002860/header.jpg',
    // Roguelike
    'hades': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
    'dead cells': 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg',
    'risk of rain 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg',
    'slay the spire': 'https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg',
    'vampire survivors': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1794440/header.jpg',
    'the binding of isaac: repentance': 'https://cdn.cloudflare.steamstatic.com/steam/apps/250900/header.jpg',
    'returnal': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1649240/header.jpg',
    'inscryption': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1092790/header.jpg',
    // Simulacion/Sandbox
    'stardew valley': 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
    'terraria': 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg',
    "no man's sky": 'https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg',
    'subnautica': 'https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg',
    'valheim': 'https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg',
    'satisfactory': 'https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg',
    'factorio': 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg',
    'rust': 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
    'sons of the forest': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/header.jpg',
    'grounded': 'https://cdn.cloudflare.steamstatic.com/steam/apps/962130/header.jpg',
    'planet zoo': 'https://cdn.cloudflare.steamstatic.com/steam/apps/703080/header.jpg',
    'cities: skylines ii': 'https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg',
    // Estrategia
    'civilization vi': 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
    'total war: warhammer iii': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/header.jpg',
    'age of empires iv': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg',
    'starfield': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
    // Carreras/Deportes
    'forza horizon 5': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg',
    'rocket league': 'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg',
    // Aventura narrativa
    'outer wilds': 'https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg',
    'what remains of edith finch': 'https://cdn.cloudflare.steamstatic.com/steam/apps/501300/header.jpg',
    'firewatch': 'https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg',
    'soma': 'https://cdn.cloudflare.steamstatic.com/steam/apps/282140/header.jpg',
    'inside': 'https://cdn.cloudflare.steamstatic.com/steam/apps/304430/header.jpg',
    'limbo': 'https://cdn.cloudflare.steamstatic.com/steam/apps/48000/header.jpg',
    "don't starve together": 'https://cdn.cloudflare.steamstatic.com/steam/apps/322330/header.jpg',
    // Terror
    'resident evil village': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg',
    'resident evil 4 remake': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
    'resident evil 2 remake': 'https://cdn.cloudflare.steamstatic.com/steam/apps/883710/header.jpg',
    'little nightmares ii': 'https://cdn.cloudflare.steamstatic.com/steam/apps/860510/header.jpg',
    // Multijugador
    'among us': 'https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg',
    'portal 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg',
    'dota 2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    // Monster Hunter
    'monster hunter world': 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg',
    'monster hunter rise': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1446780/header.jpg',
    'monster hunter world: iceborne': 'https://cdn.cloudflare.steamstatic.com/steam/apps/794489/header.jpg',
    // MMO
    'final fantasy xiv: endwalker': 'https://cdn.cloudflare.steamstatic.com/steam/apps/39210/header.jpg',
    'lost ark': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg',
    // Nintendo Switch
    'the legend of zelda: tears of the kingdom': 'https://upload.wikimedia.org/wikipedia/en/4/4e/The_Legend_of_Zelda-_Tears_of_the_Kingdom_cover.jpg',
    'the legend of zelda: breath of the wild': 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
    'super mario odyssey': 'https://upload.wikimedia.org/wikipedia/en/8/8b/Super_Mario_Odyssey.jpg',
    'super mario bros. wonder': 'https://upload.wikimedia.org/wikipedia/en/1/17/Super_Mario_Bros._Wonder_cover_artwork.jpg',
    'mario kart 8 deluxe': 'https://upload.wikimedia.org/wikipedia/en/7/72/MarioKart8Deluxe.jpg',
    'metroid dread': 'https://upload.wikimedia.org/wikipedia/en/0/03/Metroid_Dread_cover.jpg',
    'splatoon 3': 'https://upload.wikimedia.org/wikipedia/en/d/da/Splatoon_3_cover_art.jpg',
    'pokemon scarlet': 'https://upload.wikimedia.org/wikipedia/en/1/18/Pokemon_Scarlet_cover.jpg',
    'animal crossing: new horizons': 'https://upload.wikimedia.org/wikipedia/en/8/8f/Animal_Crossing_New_Horizons.jpg',
    'xenoblade chronicles 3': 'https://upload.wikimedia.org/wikipedia/en/f/f0/Xenoblade_Chronicles_3.jpg',
    'kirby and the forgotten land': 'https://upload.wikimedia.org/wikipedia/en/3/34/Kirby_and_the_Forgotten_Land.jpg',
    'fire emblem engage': 'https://upload.wikimedia.org/wikipedia/en/e/e7/Fire_Emblem_Engage.jpg',
    // Deckbuilder
    'monster train': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1102190/header.jpg',
};

const getGameCoverUrl = (nombre = '') => {
    return GAME_COVERS[nombre.toLowerCase()]
        ?? 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop';
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
    const [myRating, setMyRating] = useState(0);

    const [platformFilter, setPlatformFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [favorites, setFavorites] = useState([]);
    const [showFavsOnly, setShowFavsOnly] = useState(false);

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

        const term = search.toLowerCase();
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
    }, [games, search, platformFilter, sortBy, favorites, showFavsOnly]);

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
                                        src={detailGame.imagenUrl || getGameCoverUrl(detailGame.nombre)}
                                        alt={detailGame.nombre}
                                        onError={(e) => { e.currentTarget.src = getGameCoverUrl(detailGame.nombre); }}
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
                                        <div className="card-banner">
                                            <img
                                                src={game.imagenUrl || getGameCoverUrl(game.nombre)}
                                                alt={game.nombre}
                                                loading="lazy"
                                                onError={(e) => { e.currentTarget.src = getGameCoverUrl(game.nombre); }}
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
                )}

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
