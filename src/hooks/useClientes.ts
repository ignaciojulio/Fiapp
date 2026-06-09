import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { SQLiteClientRepository } from '../infrastructure/repositories/SQLiteClientRepository';
import type { Client } from '../domain/entities/Client';

// Definimos la Query Key estricta como una constante inmutable (Tuple)
export const CLIENTES_QUERY_KEY = ['clientes'] as const;

export const useClientes = () => {
  const { db, isReady } = useDatabase();
  const clientRepository = useMemo(() => {
    if (!isReady || !db) return null;
    return new SQLiteClientRepository(db);
  }, [db, isReady]);

  const query = useQuery<Client[]>({
    queryKey: CLIENTES_QUERY_KEY,
    queryFn: async (): Promise<Client[]> => {
      if (!clientRepository) {
        throw new Error('Repositorio no inicializado');
      }
      return clientRepository.getAll();
    },
    enabled: !!clientRepository,
  });

  const clientes = query.data ?? [];

  return {
    ...query,
    clientes,
  };
};
