import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCOP } from '../utils/formatCOP';

interface TransactionItemProps {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  date,
  description,
  amount,
  type,
}) => {
  const isDebit = type === 'debit';
  const Icon = isDebit ? ArrowUpRight : ArrowDownLeft;
  const badgeBg = isDebit ? 'var(--debt-subtle)' : 'var(--credit-subtle)';
  const iconColor = isDebit ? 'var(--debt)' : 'var(--credit)';
  const amountColor = isDebit ? 'var(--debt)' : 'var(--credit)';
  const amountPrefix = isDebit ? '+' : '-';

  return (
    <div className="flex items-center gap-4 p-4 rounded-[20px] shadow-sm bg-[var(--card)]">
      {/* Badge de ícono */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: badgeBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[var(--foreground)] truncate">
          {description}
        </p>
        <p className="text-sm mt-0.5 text-[var(--muted-foreground)]">{date}</p>
      </div>

      {/* Monto */}
      <div
        className="flex-shrink-0 font-bold text-base"
        style={{ color: amountColor }}
      >
        {amountPrefix}
        {formatCOP(amount)}
      </div>
    </div>
  );
};
