import React, { useState, useEffect } from 'react';
import { videoGameApi } from '../api/client';
import StarRating from './stars';
import {
    Trash2, Plus, Gamepad2, Info, Tag,
    DollarSign, Loader2, Search, X,
    Sparkles, Layers, RefreshCw, Star, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoGameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [newGame, setNewGame] = useState({ nombre: '', precio: '', plataforma: '', caracteristicas: '', puntuacion: 0 });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await videoGameApi.getAll();
            setGames(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data || 'Failed to connect to the vault system.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await videoGameApi.delete(id);
            setGames(games.filter(g => g.id !== id));
        } catch (err) {
            alert('Security protocol: Could not remove record.');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const gameToSubmit = {
                ...newGame,
                precio: parseFloat(newGame.precio),
                puntuacion: parseInt(newGame.puntuacion) || 0,
                id: 0
            };
            await videoGameApi.create(gameToSubmit);
            setNewGame({ nombre: '', precio: '', plataforma: '', caracteristicas: '', puntuacion: 0 });
            setIsAdding(false);
            fetchGames();
        } catch (err) {
            alert('Validation Error: Data contains invalid parameters.');
        }
    };

    const filteredGames = games.filter(g =>
        g.nombre.toLowerCase().includes(search.toLowerCase()) ||
        g.plataforma.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-12">
            {/* Hero Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold mb-2 tracking-widest text-sm uppercase">
                            <Sparkles size={16} />
                            <span>Vault Core v1.3</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                            Game <span className="text-accent-gradient">Vault</span>
                        </h1>
                        <p className="text-text-dim text-lg max-w-xl leading-relaxed">
                            Highly secure management interface for your virtual assets.
                            Integrated with distributed Ktor architecture.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={fetchGames} className="btn btn-ghost" title="Resync Data">
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="btn btn-primary"
                        >
                            {isAdding ? <X size={20} /> : <Plus size={20} />}
                            <span>{isAdding ? 'Abort' : 'New Entry'}</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mt-10">
                    <div className="absolute inset-y-0 left-4 flex items-center text-text-muted">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title or platform..."
                        className="w-full pl-12 py-4 bg-white/5 border-glass-border focus:bg-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </motion.header>

            {/* Adding Form Section */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -20 }}
                        className="overflow-hidden mb-16"
                    >
                        <form onSubmit={handleAdd} className="glass-card p-8 border-primary/20 bg-primary/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="input-group">
                                    <label className="input-label">Title</label>
                                    <input required value={newGame.nombre} onChange={e => setNewGame({ ...newGame, nombre: e.target.value })} placeholder="Masterpiece Name" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price</label>
                                    <input required type="number" step="0.01" value={newGame.precio} onChange={e => setNewGame({ ...newGame, precio: e.target.value })} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Platform</label>
                                    <input required value={newGame.plataforma} onChange={e => setNewGame({ ...newGame, plataforma: e.target.value })} placeholder="Target System" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Traits</label>
                                    <input value={newGame.caracteristicas} onChange={e => setNewGame({ ...newGame, caracteristicas: e.target.value })} placeholder="Descriptors" />
                                </div>
                            </div>
                            <div className="mt-8 space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="border-t border-primary/20 pt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Star size={24} className="text-accent" />
                                        <label className="input-label block m-0 font-bold text-lg">Rate this Game</label>
                                    </div>
                                    <StarRating 
                                        initialRating={newGame.puntuacion} 
                                        onRate={(rating) => setNewGame({ ...newGame, puntuacion: rating })}
                                    />
                                </motion.div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAdding(false)}
                                        className="btn btn-ghost"
                                    >
                                        <X size={20} />
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary px-10">
                                        <Layers size={20} />
                                        Authorize Entry
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid */}
            {loading && games.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                    <Loader2 className="animate-spin text-primary mb-4" size={48} />
                    <p className="font-heading text-xl tracking-widest uppercase">Decrypting Vault...</p>
                </div>
            ) : (
                <div className="grid-vault">
                    <AnimatePresence mode="popLayout">
                        {filteredGames.map((game, idx) => (
                            <motion.div
                                layout
                                key={game.id}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="glass-card p-6 flex flex-col group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                        <Gamepad2 size={24} />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-mono tracking-tighter text-text-dim border border-glass-border">
                                        ID: {game.id.toString().padStart(4, '0')}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                                    {game.nombre}
                                </h3>
                                <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                                    <Tag size={16} />
                                    <span className="text-sm uppercase tracking-wider">{game.plataforma}</span>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-glass-border">
                                        <div className="text-text-muted text-xs uppercase font-bold tracking-widest">Pricing</div>
                                        <div className="text-2xl font-black font-heading text-accent">
                                            {game.precio}<span className="text-sm ml-1">€</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-5 rounded-xl bg-gradient-to-br from-accent/15 to-primary/5 border border-accent/30 backdrop-blur-sm"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <Star size={18} className="text-accent" />
                                                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Community Rating</span>
                                            </div>
                                            <StarRating 
                                                initialRating={game.puntuacion ?? 0}
                                                onRate={(rating) => {
                                                    const updatedGames = games.map(g => 
                                                        g.id === game.id ? { ...g, puntuacion: rating } : g
                                                    );
                                                    setGames(updatedGames);
                                                }}
                                            />
                                        </motion.div>
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-glass-border">
                                            <Eye size={16} className="text-blue-400" />
                                            <div className="text-sm">
                                                <div className="text-xs text-text-muted uppercase font-semibold">Visits</div>
                                                <div className="text-lg font-bold">{game.visitas ?? 0}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-text-dim line-clamp-2 italic px-2">
                                        "{game.caracteristicas}"
                                    </p>

                                    <button
                                        onClick={() => handleDelete(game.id)}
                                        className="btn btn-danger-dim w-full mt-4"
                                    >
                                        <Trash2 size={18} />
                                        <span>Deauthorize</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Error & Empty States */}
            {!loading && filteredGames.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 glass-card border-dashed border-2 bg-transparent"
                >
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                        <Search size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No matching records</h3>
                    <p className="text-text-dim">Try adjusting your search filters or add a new entry.</p>
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

export default VideoGameList;
