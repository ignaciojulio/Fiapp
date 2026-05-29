import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '../context/useDatabase';

export const useClientes = () => {
  const { db, isReady } = useDatabase();

  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      if (!isReady || !db) throw new Error('Acceso prematuro a la DB');

      const result = await db.query('SELECT * FROM clientes;');
      return result.values || [];
    },
    enabled: isReady,
    staleTime: 1000 * 60 * 5,
  });
};
