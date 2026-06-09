/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Client } from '../domain/entities/Client';
import { MockClientRepository } from '../infrastructure/repositories/MockClientRepository';
import {
  ClientService,
  type CreateClientData,
} from '../application/services/ClientService';
import {
  TransactionService,
  type AddTransactionData,
} from '../application/services/TransactionService';

// --- Composition Root ---
// Aquí es donde "cableamos" nuestra aplicación.
// Decidimos qué implementación concreta del repositorio usar.
const clientRepository = new MockClientRepository();
const clientService = new ClientService(clientRepository);
const transactionService = new TransactionService(clientRepository);
// ---

interface ClientsViewModel {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  addClient: (data: CreateClientData) => Promise<void>;
  addTransaction: (clientId: string, data: AddTransactionData) => Promise<void>;
  clearAll: () => Promise<void>;
  getClientById: (id: string) => Client | undefined;
}

const ClientsContext = createContext<ClientsViewModel | undefined>(undefined);

export const ClientsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const allClients = await clientRepository.getAll();
      setClients(allClients);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar clientes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const addClient = useCallback(
    async (data: CreateClientData) => {
      await clientService.createClient(data);
      await loadClients(); // Recargar para reflejar el cambio
    },
    [loadClients]
  );

  const addTransaction = useCallback(
    async (clientId: string, data: AddTransactionData) => {
      await transactionService.addTransaction(clientId, data);
      await loadClients(); // Recargar para reflejar el cambio
    },
    [loadClients]
  );

  const clearAll = useCallback(async () => {
    await clientRepository.clearAll();
    await loadClients();
  }, [loadClients]);

  const getClientById = (id: string) => {
    return clients.find((c) => c.id === id);
  };

  const viewModel = useMemo(
    () => ({
      clients,
      isLoading,
      error,
      addClient,
      addTransaction,
      clearAll,
      getClientById,
    }),
    [clients, isLoading, error, addClient, addTransaction, clearAll]
  );

  return (
    <ClientsContext.Provider value={viewModel}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = (): ClientsViewModel => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients debe ser usado dentro de un ClientsProvider');
  }
  return context;
};
