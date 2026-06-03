import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
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

  useEffect(() => {
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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            habeas_data_accepted INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        setDb(connection);
        setIsReady(true);
      } catch (err) {
        console.error('Fallo crítico en SQLiteProvider:', err);
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
