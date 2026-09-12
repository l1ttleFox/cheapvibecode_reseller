const apiUrl = (import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://relay-ai-ami6.onrender.com' : '')
).replace(/\/$/, '');
const REQUEST_TIMEOUT = 30000;

async function request(path, key, signal) {
  const requestSignal = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT)])
    : AbortSignal.timeout(REQUEST_TIMEOUT);
  const response = await fetch(`${apiUrl}/api/${path}`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
    signal: requestSignal, cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Сервер вернул HTTP ${response.status}`);
  if (!data) throw new Error('Некорректный ответ сервера');
  return data;
}
export const api = {
  getAccount: (key, signal) => request('account', key, signal),
  getModels: (key, signal) => request('models', key, signal),
  getInstructions: signal => request('instructions', '', signal),
};
