import type { Transaction } from './Transaction';

export interface Client {
  id: string; // UUID
  name: string;
  phone: string;
  /** El cliente ha aceptado la política de tratamiento de datos (Habeas Data). */
  habeas_data_flag: boolean;
  /** El saldo vivo del cliente. Positivo significa que me debe dinero. */
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
}
