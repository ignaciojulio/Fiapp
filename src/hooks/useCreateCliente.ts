import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CLIENTES_QUERY_KEY } from './useClientes';
import type { Client } from '../domain/entities/Client';
import { useServices } from '../context/ServicesContext'; // Suponiendo la nueva ubicación

export type CreateClientePayload = {
  name: string;
  phone: string;
  habeas_data_flag: boolean;
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  const { clientService } = useServices();

  return useMutation<
    Client,
    Error,
    CreateClientePayload,
    { previousClientes: Client[] | undefined }
  >({
    mutationFn: async (nuevoCliente) => {
      if (!clientService) throw new Error('Servicio no inicializado');
      return clientService.createClient(nuevoCliente);
    },
    onMutate: async (nuevoCliente) => {
      await queryClient.cancelQueries({ queryKey: CLIENTES_QUERY_KEY });

      const previousClientes =
        queryClient.getQueryData<Client[]>(CLIENTES_QUERY_KEY);

      // Creamos un cliente optimista que coincide con la entidad de dominio
      const optimisticClient: Client = {
        id: `temp-${Date.now()}`,
        name: nuevoCliente.name,
        phone: nuevoCliente.phone,
        habeas_data_flag: nuevoCliente.habeas_data_flag,
        balance: 0,
        transactions: [],
        createdAt: new Date(),
      };

      queryClient.setQueryData<Client[]>(CLIENTES_QUERY_KEY, (current) =>
        current ? [optimisticClient, ...current] : [optimisticClient]
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
