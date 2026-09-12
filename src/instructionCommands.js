// API-key placeholders in shell templates are enclosed in single quotes.
export function personalizeCommand(template, apiKey, language) {
  if (!apiKey) return template;
  const escaped = language === 'text' ? apiKey : language === 'powershell'
    ? apiKey.replaceAll("'", "''")
    : apiKey.replaceAll("'", "'\\''");
  return template.replaceAll('YOUR_API_KEY', () => escaped);
}

export function instructionStep(step, hasKey) {
  return step
    .replace('купленным ключом', 'вашим ключом')
    .replace('к настройкам провайдера', 'к настройкам подключения')
    .replace('настройки провайдера', 'настройки подключения')
    .replace(/Выберите команду для своей ОС и замените YOUR_API_KEY вашим ключом\./g,
      hasKey ? 'Выберите команду для своей ОС. Ваш ключ уже подставлен.' : 'Добавьте API-ключ, чтобы получить готовую команду.')
    .replace('Выполните команду для своей ОС, заменив YOUR_API_KEY.',
      hasKey ? 'Выполните команду для своей ОС. Ваш ключ уже подставлен.' : 'Добавьте API-ключ, чтобы получить готовую команду.')
    .replace('Задайте OPENAI_API_KEY вашим ключом.',
      hasKey ? 'Выполните команду настройки окружения с вашим ключом.' : 'Добавьте API-ключ для настройки окружения.');
}
