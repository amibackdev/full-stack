import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ToastCtx {
  push: (text: string) => void;
}
const Ctx = createContext<ToastCtx>({ push: () => undefined });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, text }]);
    window.setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 6000);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((i) => (
          <div key={i.id} className="toast">
            {i.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
