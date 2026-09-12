import { createApp } from './app.mjs';
import { createProvider } from './provider.mjs';

const port = Number(process.env.PORT || 3000);
const server = createApp({ request: createProvider() });
server.listen(port, '127.0.0.1', () => console.log(`Relay API: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  server.close(() => process.exit(0));
});
