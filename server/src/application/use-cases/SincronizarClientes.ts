import { ClienteRepository } from '../../domain/repositories/ClienteRepository';

export class SincronizarClientes {
    constructor(private readonly clienteRepository: ClienteRepository) {}

    public async execute(datosDelCliente: Record<string, unknown>): Promise<void> {
        await this.clienteRepository.guardar(datosDelCliente);
    }
}   