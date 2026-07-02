import { SqliteClienteRepository } from './infrastructure/persistence/SqliteClienteRepository';
import { SincronizarClientes } from './application/use-cases/SincronizarClientes';
import { HealthController } from './interfaces/http/health/HealthController';
import express from 'express';

const app = express();

const clienteRepository = new SqliteClienteRepository();
const sincronizarClientes = new SincronizarClientes(clienteRepository);
const healthController = new HealthController();

app.get('/health', (req, res) => {
    healthController.getStatus(req, res);
});

app.post('/sincronizar', async (req, res) => {

    await sincronizarClientes.execute(req.body);
    res.status(200).send('Datos del cliente sincronizados correctamente.');
}); 