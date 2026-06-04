import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useState, useRef } from 'react';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

interface SQLiteContextProps {
  db: SQLiteDBConnection | null;
  isReady: boolean;
}

export const DatabaseContext = createContext<SQLiteContextProps>({
  db: null,
  isReady: false,
});

export const SQLiteProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLiteDBConnection | null>(null);
  const [isReady, setIsReady] = useState(false);
  const initLock = useRef(false);

  useEffect(() => {
    if (initLock.current) return;
    initLock.current = true;

    const initialize = async () => {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      try {
        await sqlite.checkConnectionsConsistency();

        const isConn = (await sqlite.isConnection('main_db', false)).result;
        let connection: SQLiteDBConnection;

        if (isConn) {
          connection = await sqlite.retrieveConnection('main_db', false);
        } else {
          connection = await sqlite.createConnection(
            'main_db',
            false,
            'no-encryption',
            1,
            false
          );
        }

        await connection.open();

        await connection.execute(`
          CREATE TABLE IF NOT EXISTS clientes (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            habeas_data_accepted INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
          );
        `);

        setDb(connection);
        setIsReady(true);
      } catch (err) {
        console.error('Fallo crítico en SQLiteProvider:', err);
        // En un escenario real offline-first podríamos lanzar una UI de error fatal aquí.
      }
    };

    initialize();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};
