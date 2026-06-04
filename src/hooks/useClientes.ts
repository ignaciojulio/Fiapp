import { useQuery } from '@tanstack/react-query';
import { useDatabase } from '../context/useDatabase';

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  habeas_data_accepted: number;
  created_at: string;
}

export const useClientes = () => {
  const { db, isReady } = useDatabase();

  return useQuery({
    queryKey: ['clientes'],
    queryFn: async (): Promise<Cliente[]> => {
      if (!isReady || !db) throw new Error('Acceso prematuro a la DB');

      const result = await db.query(
        'SELECT * FROM clientes ORDER BY created_at DESC;'
      );
      return result.values || [];
    },
    enabled: isReady,
    staleTime: 1000 * 60 * 5,
  });
};
