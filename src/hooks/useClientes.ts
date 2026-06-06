import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '../context/useDatabase';

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  habeas_data_accepted: number;
  created_at: string;
}

export interface CreateClientePayload {
  nombre: string;
  telefono: string;
  habeas_data_accepted: boolean;
}

// Definimos la Query Key estricta como una constante inmutable (Tuple)
export const CLIENTES_QUERY_KEY = ['clientes'] as const;

export const useClientes = () => {
  const { db, isReady } = useDatabase();

  return useQuery({
    queryKey: CLIENTES_QUERY_KEY,
    queryFn: async (): Promise<Cliente[]> => {
      if (!isReady || !db) throw new Error('Acceso prematuro a la DB');

      const result = await db.query(
        'SELECT * FROM clientes ORDER BY created_at DESC;'
      );
      return result.values || [];
    },
    enabled: isReady,
    // staleTime: 0 es el valor por defecto en TanStack Query. De este modo,
    // cada invalidación forzará una lectura real desde SQLite.
  });
};

export const useCreateCliente = () => {
  const { db } = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoCliente: CreateClientePayload) => {
      if (!db) throw new Error('Conexión a disco fallida');

      return await db.run(
        'INSERT INTO clientes (nombre, telefono, habeas_data_accepted) VALUES (?, ?, ?);',
        [
          nuevoCliente.nombre,
          nuevoCliente.telefono,
          nuevoCliente.habeas_data_accepted ? 1 : 0,
        ]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY });
    },
  });
};
