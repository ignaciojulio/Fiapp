import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { ClientService } from '../app/ClientService';
import { SQLiteClientRepository } from '../infrastructure/repositories/SQLiteClientRepository';

interface ServicesContextType {
  clientService: ClientService | null;
  // Agrega aquí otros servicios si los necesitas en el futuro
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const { db, isReady } = useDatabase();

  const clientService = useMemo(() => {
    if (!isReady || !db) return null;
    const repo = new SQLiteClientRepository(db);
    return new ClientService(repo);
  }, [db, isReady]);

  const contextValue = useMemo(() => ({ clientService }), [clientService]);

  return (
    <ServicesContext.Provider value={contextValue}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
