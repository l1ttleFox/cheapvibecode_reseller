import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ text: '', error: false, visible: false });
  const timer = useRef(null);
  const show = useCallback((text, error = false) => {
    clearTimeout(timer.current);
    setToast({ text, error, visible: true });
    timer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2600);
  }, []);
  return <ToastContext.Provider value={show}>
    {children}
    <div className={`toast ${toast.visible ? 'is-visible' : ''} ${toast.error ? 'is-error' : ''}`} role="status" aria-live="polite">
      <span className="lamp" />{toast.text}
    </div>
  </ToastContext.Provider>;
}
