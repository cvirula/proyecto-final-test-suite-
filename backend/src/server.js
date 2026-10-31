import { resolve } from 'node:path';
import { createDatabase, seedDatabase } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3100);
const dbPath = process.env.DB_PATH ? resolve(process.env.DB_PATH) : resolve('.data/library.db');
const db = createDatabase(dbPath);
seedDatabase(db);

const app = createApp({ db, enableTestRoutes: process.env.ENABLE_TEST_ROUTES === 'true' });
const server = app.listen(port, () => console.log(`Biblioteca API disponible en http://localhost:${port}`));

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
