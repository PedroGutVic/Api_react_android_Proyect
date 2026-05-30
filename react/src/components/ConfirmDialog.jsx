import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext(null);

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
    const [state, setState] = useState(null);
    const resolveRef = useRef(null);

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setState({ message });
        });
    }, []);

    const handleConfirm = () => { setState(null); resolveRef.current?.(true); };
    const handleCancel  = () => { setState(null); resolveRef.current?.(false); };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <AnimatePresence>
                {state && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={handleCancel}>
                        <motion.div
                            className="modal-content"
                            style={{ maxWidth: 420 }}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3 style={{ fontFamily: 'Fraunces', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <AlertTriangle size={20} style={{ color: '#ef4444' }} />
                                    Confirmar acción
                                </h3>
                                <button className="theme-toggle" onClick={handleCancel}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div style={{ padding: '24px 30px 30px' }}>
                                <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>{state.message}</p>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                                    <button className="button button-ghost" onClick={handleCancel}>Cancelar</button>
                                    <button
                                        className="button"
                                        style={{ background: '#ef4444', color: '#fff', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
                                        onClick={handleConfirm}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ConfirmContext.Provider>
    );
};
