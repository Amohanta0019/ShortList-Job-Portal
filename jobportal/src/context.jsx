import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saved-jobs')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('saved-jobs', JSON.stringify(saved)); }, [saved]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((message, tone = 'ok') => setToast({ message, tone }), []);
  const toggleSaved = useCallback((id) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);

  return (
    <Ctx.Provider value={{ notify, saved, toggleSaved }}>
      {children}
      {toast && <div className={`toast ${toast.tone}`} role="status">{toast.message}</div>}
    </Ctx.Provider>
  );
}
