/**
 * El tipo de transacción.
 * DEUDA: El cliente adquiere una deuda conmigo (le fío). Aumenta su saldo.
 * ABONO: El cliente paga parte o la totalidad de su deuda. Disminuye su saldo.
 */
export type TransactionType = 'DEUDA' | 'ABONO';

export interface Transaction {
  id: string; // UUID
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: Date;
}
