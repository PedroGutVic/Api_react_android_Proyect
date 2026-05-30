import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = ++nextId;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const dismiss = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            className={`toast toast-${toast.type}`}
                            initial={{ opacity: 0, x: 60, scale: 0.92 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.92 }}
                            transition={{ duration: 0.22 }}
                        >
                            <span className="toast-icon">
                                {toast.type === 'success' && <CheckCircle size={18} />}
                                {toast.type === 'error' && <XCircle size={18} />}
                                {toast.type === 'info' && <Info size={18} />}
                            </span>
                            <span className="toast-message">{toast.message}</span>
                            <button className="toast-close" onClick={() => dismiss(toast.id)}>
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
