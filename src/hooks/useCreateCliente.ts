import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '../context/useDatabase';
import {
  CLIENTES_QUERY_KEY,
  type Cliente,
  type CreateClientePayload,
} from './useClientes';

export const useCreateCliente = () => {
  const { db } = useDatabase();
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    CreateClientePayload,
    { previousClientes: Cliente[] | undefined }
  >({
    mutationFn: async (nuevoCliente) => {
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
    onMutate: async (nuevoCliente) => {
      await queryClient.cancelQueries({ queryKey: CLIENTES_QUERY_KEY });

      const previousClientes =
        queryClient.getQueryData<Cliente[]>(CLIENTES_QUERY_KEY);

      const optimisticCliente: Cliente = {
        id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        nombre: nuevoCliente.nombre,
        telefono: nuevoCliente.telefono,
        habeas_data_accepted: nuevoCliente.habeas_data_accepted ? 1 : 0,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Cliente[]>(CLIENTES_QUERY_KEY, (current) =>
        current ? [optimisticCliente, ...current] : [optimisticCliente]
      );

      return { previousClientes };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousClientes) {
        queryClient.setQueryData(CLIENTES_QUERY_KEY, context.previousClientes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CLIENTES_QUERY_KEY,
        exact: true,
      });
    },
  });
};
