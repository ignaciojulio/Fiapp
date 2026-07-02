import { ClienteRepository } from '../../domain/repositories/ClienteRepository';

export class SqliteClienteRepository implements ClienteRepository {
    public async guardar(datosDelCliente: Record<string, unknown>): Promise<void> {
        console.log('Guardando datos del cliente en SQLite:', datosDelCliente);
        
    }
}  