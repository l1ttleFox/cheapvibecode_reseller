import { createApp } from './app.mjs';
import { createProvider } from './provider.mjs';

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const server = createApp({ request: createProvider() });
server.listen(port, host, () => console.log(`Relay API: http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  server.close(() => process.exit(0));
});
