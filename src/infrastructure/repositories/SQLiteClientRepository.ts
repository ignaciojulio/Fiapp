import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { Client } from '../../domain/entities/Client';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';

const TABLE_NAME = 'clients';

export class SQLiteClientRepository implements ClientRepository {
  constructor(private readonly db: SQLiteDBConnection) {}

  async getAll(): Promise<Client[]> {
    const statement = `SELECT * FROM ${TABLE_NAME} ORDER BY createdAt DESC;`;
    const result = await this.db.query(statement);

    return (result.values || []).map((client: any) => ({
      ...client,
      habeas_data_flag: !!client.habeas_data_flag,
      transactions: JSON.parse(client.transactions),
      createdAt: new Date(client.createdAt),
    }));
  }

  async findById(id: string): Promise<Client | null> {
    const statement = `SELECT * FROM ${TABLE_NAME} WHERE id = ?;`;
    const result = await this.db.query(statement, [id]);

    if (!result.values || result.values.length === 0) {
      return null;
    }

    const client: any = result.values[0];
    return {
      ...client,
      habeas_data_flag: !!client.habeas_data_flag,
      transactions: JSON.parse(client.transactions),
      createdAt: new Date(client.createdAt),
    };
  }

  async save(client: Client): Promise<void> {
    const statement = `
      INSERT INTO ${TABLE_NAME} (id, name, phone, habeas_data_flag, balance, transactions, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        phone = excluded.phone,
        habeas_data_flag = excluded.habeas_data_flag,
        balance = excluded.balance,
        transactions = excluded.transactions;
    `;
    await this.db.run(statement, [
      client.id,
      client.name,
      client.phone,
      client.habeas_data_flag ? 1 : 0,
      client.balance,
      JSON.stringify(client.transactions),
      client.createdAt.toISOString(),
    ]);
  }

  async clearAll(): Promise<void> {
    const statement = `DELETE FROM ${TABLE_NAME};`;
    await this.db.run(statement);
  }
}
