import type { Client } from '../../domain/entities/Client';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';

/**
 * Implementación en memoria del Repositorio de Clientes.
 * Ideal para desarrollo, pruebas o modo offline.
 * Mantiene los datos solo mientras la aplicación está en ejecución.
 */
export class MockClientRepository implements ClientRepository {
  private clients: Map<string, Client> = new Map();

  async getAll(): Promise<Client[]> {
    const allClients = Array.from(this.clients.values());
    // Ordenamos por fecha de creación para mostrar los más recientes primero
    allClients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allClients;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.clients.get(id);
    return client ?? null;
  }

  async save(client: Client): Promise<void> {
    // Simula una operación de "upsert" (update or insert)
    this.clients.set(client.id, client);
  }
}
