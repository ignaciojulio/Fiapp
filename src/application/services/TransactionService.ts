import { v4 as uuidv4 } from 'uuid';
import type {
  Transaction,
  TransactionType,
} from '../../domain/entities/Transaction';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';

export type AddTransactionData = {
  amount: number;
  description: string;
  type: TransactionType;
};

export class TransactionService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async addTransaction(
    clientId: string,
    data: AddTransactionData
  ): Promise<void> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Cliente no encontrado para añadir la transacción.');
    }

    const newTransaction: Transaction = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
    };

    // Regla de negocio: Cálculo del nuevo saldo.
    const newBalance =
      data.type === 'DEUDA'
        ? client.balance + data.amount
        : client.balance - data.amount;

    // Actualizamos el cliente con la nueva transacción y el saldo recalculado.
    client.balance = newBalance;
    client.transactions.unshift(newTransaction); // Añadir al principio

    await this.clientRepository.save(client);
  }
}
