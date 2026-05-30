import { useEffect } from 'react';

const useEscapeKey = (handler) => {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handler(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [handler]);
};

export default useEscapeKey;
