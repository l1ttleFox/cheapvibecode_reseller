async function request(path, key, signal) {
  const response = await fetch(`/api/${path}`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
    signal, cache: 'no-store',
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
