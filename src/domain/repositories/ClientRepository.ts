import type { Client } from '../entities/Client';

/**
 * Define las operaciones de persistencia para la entidad Cliente.
 * Es el puerto a través del cual la capa de aplicación se comunica
 * con la capa de infraestructura de datos.
 */
export interface ClientRepository {
  getAll(): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  /** Guarda un cliente, ya sea creándolo si es nuevo o actualizándolo si ya existe. */
  save(client: Client): Promise<void>;
}
