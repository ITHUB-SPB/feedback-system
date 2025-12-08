import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { PGlite } from '@electric-sql/pglite'

export default function useLiteServer() {
  const db = new PGlite({ debug: 2, dataDir: '../pglite', database: "feedback" });

  db.query('SELECT version()')
    // @ts-ignore
    .then((v) => console.log('PGLite version:', v?.rows?.[0]?.version))
    .catch((err) => console.error('Database error:', err));

  const pgLiteServer = new PGLiteSocketServer({
    db,
    port: 5432,
    host: '127.0.0.1',
    inspect: true,
    debug: true,
  });

  return {
    start: () => pgLiteServer.start(),
    db,
    close: async () => {
      try {
        await pgLiteServer.stop();
      } catch (error) {
        console.warn('Error stopping PGLite server:', error);
      }
      try {
        await db.close();
      } catch (error) {
        console.warn('Error closing PGLite database:', error);
      }
    }
  };
}