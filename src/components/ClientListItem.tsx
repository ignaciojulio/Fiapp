import React from 'react';
import { ChevronRight } from 'lucide-react';
import { formatCOP } from '../utils/formatCOP';

interface ClientListItemProps {
  name: string;
  amount: number;
  lastDate?: string;
  onClick?: () => void;
}

export const ClientListItem: React.FC<ClientListItemProps> = ({
  name,
  amount,
  lastDate,
  onClick,
}) => {
  const getAvatarColors = (clientName: string) => {
    const charCode = clientName.charCodeAt(0);
    const colorIndex = charCode % 4;

    switch (colorIndex) {
      case 0:
        return { bg: 'var(--primary-subtle)', text: 'var(--primary)' };
      case 1:
        return { bg: 'var(--credit-subtle)', text: 'var(--credit)' };
      case 2:
        return { bg: '#FEF3C7', text: '#B45309' }; // Amber fijo
      case 3:
        return { bg: '#EDE9FE', text: '#6D28D9' }; // Violeta fijo
      default:
        return { bg: 'var(--primary-subtle)', text: 'var(--primary)' };
    }
  };

  const { bg, text } = getAvatarColors(name);
  const initials = name.charAt(0).toUpperCase();

  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-[20px] bg-[var(--card)] p-4 shadow-sm transition-transform active:scale-[0.99]"
      onClick={onClick}
    >
      {/* Avatar */}
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: bg }}
      >
        <span className="text-base font-semibold" style={{ color: text }}>
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[var(--foreground)]">
          {name}
        </p>
        {lastDate && (
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            Último: {lastDate}
          </p>
        )}
      </div>

      {/* Monto y Chevron */}
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <span className="text-base font-bold text-[var(--debt)]">
          {formatCOP(amount)}
        </span>
        <ChevronRight className="h-4 w-4 text-[var(--switch-background)]" />
      </div>
    </div>
  );
};
