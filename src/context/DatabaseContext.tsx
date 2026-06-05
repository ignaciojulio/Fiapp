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

// 🚀 SINGLETON A NIVEL DE MÓDULO (Inmune al ciclo de vida de React)
let sqliteConnection: SQLiteConnection | null = null;
let globalDbInstance: SQLiteDBConnection | null = null;
let initPromise: Promise<SQLiteDBConnection> | null = null;

export const SQLiteProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLiteDBConnection | null>(globalDbInstance);
  const [isReady, setIsReady] = useState<boolean>(!!globalDbInstance);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        if (!initPromise) {
          initPromise = (async () => {
            if (!sqliteConnection) {
              sqliteConnection = new SQLiteConnection(CapacitorSQLite);
            }
            await sqliteConnection.checkConnectionsConsistency();
            const isConn = (
              await sqliteConnection.isConnection('main_db', false)
            ).result;
            let connection: SQLiteDBConnection;

            if (isConn) {
              connection = await sqliteConnection.retrieveConnection(
                'main_db',
                false
              );
            } else {
              connection = await sqliteConnection.createConnection(
                'main_db',
                false,
                'no-encryption',
                1,
                false
              );
            }

            await connection.open();
            return connection;
          })();
        }

        const connection = await initPromise;
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS clientes (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            habeas_data_accepted INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
          );
        `);

        globalDbInstance = connection;

        if (isMounted) {
          setDb(connection);
          setIsReady(true);
        }
      } catch (err) {
        console.error('Fallo crítico en SQLiteProvider:', err);
        initPromise = null; // Liberamos el candado para permitir reintentos
        // En un escenario real offline-first podríamos lanzar una UI de error fatal aquí.
      }
    };

    if (!globalDbInstance) {
      initialize();
    }

    // 🛑 JUSTIFICACIÓN DE CLEANUP:
    // No se invoca sqliteConnection.closeConnection() aquí en el unmount de React.
    // Al vivir a nivel de módulo, la DB vive el ciclo completo del WebView.
    // Cerrarla en unmount causaría un Fatal Exception en remounts inmediatos (Strict Mode).
    // El OS se encargará del teardown cuando la app sea finalizada.
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};
