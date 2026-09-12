const root = 'https://ru.cheapvibecode.ru';
const base = `${root}/v1`;
const sourceUrl = 'https://cheapvibecode.ru/portal/docs';
const sourceAsset = 'https://cheapvibecode.ru/_next/static/chunks/app/portal/docs/page-cd8521a709b8536b.js';
const platforms = ['Windows', 'macOS', 'Linux'];

// Routes and invocation forms transcribed from the provider's Docs bundle.
// This is application content; these scripts are never run by this backend.
function installer(id, title, routes, removeRoutes, options = {}) {
  const os = platforms.filter((_, i) => routes[i]);
  const commands = routes.flatMap((route, index) => {
    if (!route) return [];
    const windows = index === 0;
    const code = windows
      ? options.authorization
        ? `$h=@{Authorization='Bearer YOUR_API_KEY'}; iex(irm -Headers $h '${root}/${route}')`
        : `$env:CVC_API_KEY='YOUR_API_KEY'; iex(irm '${root}/${route}')`
      : options.authorization
        ? `bash <(curl -fsSL -H 'Authorization: Bearer YOUR_API_KEY' '${root}/${route}')`
        : `bash <(curl -fsSL '${root}/${route}') 'YOUR_API_KEY'`;
    const remove = removeRoutes[index];
    return [{ os: platforms[index], language: windows ? 'powershell' : 'bash', code,
      scriptUrl: `${root}/${route}`, uninstall: windows ? `iex(irm '${root}/${remove}')` : `bash <(curl -fsSL '${root}/${remove}')` }];
  });
  return {
    id, title, os, source: 'provider-docs', sourceUrl, status: 'documented',
    steps: options.steps || [`Установите ${title}.`, `Полностью закройте ${title}.`,
      'Выберите команду для своей ОС и замените YOUR_API_KEY купленным ключом.',
      'Выполните команду в PowerShell (Windows) или bash (macOS/Linux).', `Перезапустите ${title}.`],
    examples: commands, ...options,
  };
}

export function instructionCatalog() {
  const guides = [
    installer('codex', 'Codex App', ['icw', 'im', null], ['uc?shell=powershell', 'uc?shell=bash', null]),
    installer('codex-cli', 'Codex CLI', ['icw', 'icm', 'i'], ['uc?shell=powershell', 'uc?shell=bash', 'uc?shell=bash']),
    installer('vscode', 'VS Code · Codex', ['iw', 'ivm', 'i'], ['uc?shell=powershell', 'uc?shell=bash', 'uc?shell=bash']),
    installer('claude', 'Claude Code CLI', ['cw', 'cm', 'cl'], ['crw', 'crm', 'crl'], { authorization: true }),
    installer('claude-app', 'Claude App', ['iclaudew', 'iclaudem', null], ['rclaudew', 'rclaudem', null]),
    installer('opencode', 'OpenCode', ['iow', 'iom', 'iol'], ['row', 'rom', 'rol'], {
      modelFormat: 'cheapvibecode/MODEL_ID', downloadUrl: `${root}/downloads/opencode.jsonc`,
    }),
    installer('cursor', 'Cursor', ['icrw', 'icrm', 'icr'], ['rcrw', 'rcrm', 'rcrl'], {
      modelFormat: 'MODEL_ID-cursor', notice: 'По инструкции провайдера требуется подписка Cursor.',
    }),
    installer('gemini-cli', 'Gemini CLI', ['igeminiw', 'igeminim', 'igeminil'], ['rgeminiw', 'rgeminim', 'rgeminil']),
    installer('kimi-code', 'Kimi Code CLI', ['ikw', 'ikm', 'ikl'], ['rkw', 'rkm', 'rkl'], { modelFormat: 'cheapvibecode/MODEL_ID' }),
    installer('deepseek-harness', 'DeepSeek Harness', ['idhw', 'idhm', 'idhl'], ['rdhw', 'rdhm', 'rdhl'], {
      steps: ['Установите DeepSeek Harness.', 'Остановите запущенный Harness (Ctrl+C).',
        'Выполните команду для своей ОС, заменив YOUR_API_KEY.', 'Запустите npx @deepseek-ai/dsh web и откройте новую сессию.'],
    }),
    installer('pi', 'Pi', ['ipw', 'ipm', 'ipl'], ['rpw', 'rpm', 'rpl']),
    installer('hermes', 'Hermes Desktop', ['ihermesw', 'ihermesm', 'ihermesl'], ['rhermesw', 'rhermesm', 'rhermesl']),
    installer('grok-build', 'Grok Build', ['igw', 'igm', 'igl'], ['rgw', 'rgm', 'rgl']),
    {
      id: 'cheapcode', title: 'Cheap Code', os: platforms, source: 'provider-docs', sourceUrl, status: 'documented',
      steps: ['Установите Node.js с npm.', 'Выполните npm install -g @cheapcode/cli@latest.',
        'Для входа купленным ключом выполните cheapcode auth login --key.', 'Запустите cheapcode.'],
      examples: [{ language: 'shell', code: 'npm install -g @cheapcode/cli@latest\ncheapcode auth login --key\ncheapcode' }],
    },
    {
      id: 'python', title: 'OpenAI SDK · Python', os: platforms, source: 'local-example', status: 'example',
      steps: ['Установите SDK: python -m pip install openai.', 'Задайте переменные из environment, выберите MODEL_ID из каталога.', 'Сохраните example.py и выполните python example.py.'],
      examples: [{ language: 'python', filename: 'example.py', code: `import os
from openai import OpenAI
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"], base_url="${base}")
result = client.chat.completions.create(
    model=os.environ["MODEL_ID"],
    messages=[{"role": "user", "content": "Привет!"}],
)
print(result.choices[0].message.content)` }],
    },
    {
      id: 'javascript', title: 'OpenAI SDK · JavaScript', os: platforms, source: 'local-example', status: 'example',
      steps: ['Установите SDK: npm install openai.', 'Задайте переменные из environment, выберите MODEL_ID из каталога.', 'Сохраните example.mjs и выполните node example.mjs.'],
      examples: [{ language: 'javascript', filename: 'example.mjs', code: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: '${base}' });
const result = await client.chat.completions.create({
  model: process.env.MODEL_ID,
  messages: [{ role: 'user', content: 'Привет!' }],
});
console.log(result.choices[0].message.content);` }],
    },
    {
      id: 'curl', title: 'HTTP / curl', os: platforms, source: 'local-example', status: 'example',
      steps: ['Задайте OPENAI_API_KEY купленным ключом.', 'Получите каталог моделей без генерации ответа.'],
      examples: [
        { os: 'Windows', language: 'powershell', code: `curl.exe '${base}/models' -H "Authorization: Bearer $env:OPENAI_API_KEY"` },
        ...['macOS', 'Linux'].map(os => ({ os, language: 'bash', code: `curl '${base}/models' -H "Authorization: Bearer $OPENAI_API_KEY"` })),
      ],
    },
    ...['Cline', 'Roo Code', 'Continue', 'Cherry Studio', 'Chatbox'].map((title, i) => ({
      id: ['cline', 'roo', 'continue', 'cherry', 'chatbox'][i], title, os: platforms, source: 'local-example', status: 'example',
      steps: ['Установите клиент и откройте настройки провайдера.', 'Выберите OpenAI Compatible.',
        `Base URL: ${base}. API Key: купленный ключ.`, 'Выберите точный MODEL_ID из каталога /v1/models.'],
      examples: [],
    })),
  ];
  return {
    source: 'provider-docs-snapshot', sourceUrl, sourceAsset, version: '2026-09-12', autoSynced: false,
    baseUrl: base, directBaseUrl: base, connectionMode: 'direct',
    endpoints: { models: `${base}/models`, balance: `${base}/balance`, chat: `${base}/chat/completions`,
      responses: `${base}/responses`, messages: `${base}/messages`, countTokens: `${base}/messages/count_tokens`, codex: `${root}/backend-api/codex` },
    environment: [
      { os: 'Windows', shell: 'PowerShell', code: `$env:OPENAI_API_KEY = 'YOUR_API_KEY'\n$env:MODEL_ID = 'MODEL_ID'` },
      { os: 'macOS/Linux', shell: 'bash', code: `export OPENAI_API_KEY='YOUR_API_KEY'\nexport MODEL_ID='MODEL_ID'` },
    ],
    guides,
  };
}
