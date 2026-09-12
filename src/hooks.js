import { useEffect, useRef, useState } from 'react';
import { api } from './api';

/** Fetches a resource (optionally keyed by API key), polls every 60 s while visible. */
export function useResource(load, key = '', needsKey = true) {
  const [state, setState] = useState({ data: null, error: '', loading: false });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let cancelled = false;
    setState({ data: null, error: '', loading: false });
    if (needsKey && !key) return () => { controller.abort(); };
    async function refresh() {
      if (!cancelled) setState(s => ({ ...s, loading: true, error: '' }));
      try {
        const data = await load(key, controller.signal);
        if (!cancelled) setState({ data, loading: false, error: '' });
      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          setState(s => ({ ...s, loading: false, error: error.message }));
        }
      } finally {
        if (!cancelled) {
          timer = setTimeout(() => {
            if (document.visibilityState === 'visible') refresh();
            else timer = setTimeout(refresh, 60000);
          }, 60000);
        }
      }
    }
    refresh();
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, [load, key, revision, needsKey]);
  return { ...state, refresh: () => setRevision(r => r + 1) };
}

export const loadAccount = (key, signal) => api.getAccount(key, signal);
export const loadModels = (key, signal) => api.getModels(key, signal);
export const loadGuides = (_, signal) => api.getInstructions(signal);

/** Verifies a key against /api/account. Returns '' on success or a Russian error message. */
export async function verifyKey(key) {
  try {
    await api.getAccount(key);
    return '';
  } catch (error) {
    return error.message || 'Не удалось проверить ключ';
  }
}

/** Keeps a value in localStorage, tolerating disabled storage. */
export function useStoredState(storageKey, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored == null ? initial : stored;
    } catch { return initial; }
  });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(storageKey, value); } catch { /* storage may be disabled */ }
  }, [storageKey, value]);
  return [value, setValue];
}

export const fmt = value => (value == null ? '—' : value.toLocaleString('ru-RU'));
