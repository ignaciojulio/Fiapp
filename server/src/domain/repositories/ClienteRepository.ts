export interface ClienteRepository {
    guardar(datosDelCliente: Record<string, unknown>): Promise<void>;
}