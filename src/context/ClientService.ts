import { v4 as uuidv4 } from 'uuid';
import type { Client } from '../../domain/entities/Client';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';

export type CreateClientData = Omit<
  Client,
  'id' | 'balance' | 'transactions' | 'createdAt'
>;

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(data: CreateClientData): Promise<Client> {
    // Regla de negocio: No se puede crear un cliente sin su consentimiento.
    if (!data.habeas_data_flag) {
      throw new Error(
        'El cliente debe aceptar la política de tratamiento de datos.'
      );
    }

    const newClient: Client = {
      id: uuidv4(),
      ...data,
      balance: 0,
      transactions: [],
      createdAt: new Date(),
    };

    await this.clientRepository.save(newClient);
    return newClient;
  }
}
