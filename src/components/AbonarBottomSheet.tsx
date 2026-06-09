import React, { useState, FormEvent, useEffect } from 'react';
import { IonModal } from '@ionic/react';
import { X, User, AlertCircle } from 'lucide-react';
import { FloatingLabelInput } from './FloatingLabelInput';
import { formatCOP } from '../utils/formatCOP';

interface AbonarBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  currentDebt: number;
  onSave: (data: { amount: number; description: string }) => void;
}

export const AbonarBottomSheet: React.FC<AbonarBottomSheetProps> = ({
  isOpen,
  onClose,
  clientName,
  currentDebt,
  onSave,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setAmount('');
    setDescription('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedAmount = Math.round(Number(amount) / 50) * 50;
    if (parsedAmount > 0) {
      onSave({
        amount: parsedAmount,
        description: description.trim() || 'Abono',
      });
      resetForm();
      onClose();
    }
  };

  const isAmountValid = Number(amount) > 0;
  const isAmountExceedingDebt = isAmountValid && Number(amount) > currentDebt;

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.85}
      breakpoints={[0, 0.85, 1]}
      handleBehavior="cycle"
    >
      <div className="mx-auto flex h-full w-full max-w-[393px] flex-col rounded-t-[32px] bg-[var(--card)]">
        {/* Drag handle */}
        <div className="flex justify-center pb-2 pt-4">
          <div className="h-1.5 w-10 rounded-full bg-[var(--muted)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-[1px] border-[var(--border)] px-6 py-4">
          <h2 className="text-[22px] font-semibold text-[var(--foreground)]">
            Registrar Abono
          </h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)]"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Formulario y contenido */}
        <div className="px-6 pt-4">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium"
            style={{
              background: 'var(--credit-subtle)',
              color: 'var(--credit)',
            }}
          >
            <User className="h-3.5 w-3.5" />
            Abono de {clientName}
          </div>
        </div>

        {/* Deuda actual */}
        <div className="mx-6 mt-4 rounded-2xl bg-[var(--secondary)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase text-[var(--muted-foreground)]">
              Deuda actual
            </span>
            <span className="text-base font-bold text-[var(--debt)]">
              {formatCOP(currentDebt)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-grow flex-col p-6">
          {/* Campo "Monto" */}
          <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
            Monto a abonar
          </label>
          <div className="flex h-[72px] items-center gap-2 rounded-2xl bg-[var(--input-background)] px-5">
            <span className="text-[28px] font-bold text-[var(--muted-foreground)]">
              $
            </span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-[28px] font-bold text-[var(--foreground)] outline-none"
            />
          </div>

          {/* Advertencia si el monto supera la deuda */}
          {isAmountExceedingDebt && (
            <div className="mt-2 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-[var(--debt)]" />
              <span className="text-xs text-[var(--debt)]">
                El abono supera la deuda actual
              </span>
            </div>
          )}

          {/* Separador */}
          <div
            className="my-5 h-[1px]"
            style={{ background: 'var(--border)' }}
          />

          {/* Campo "Descripción" */}
          <FloatingLabelInput
            label="Descripción (opcional)"
            id="abonar-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />

          {/* Botón submit */}
          <div className="mt-auto pt-6">
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center rounded-2xl border-[1.5px] text-[17px] font-semibold transition-all active:scale-[0.98] disabled:opacity-40"
              style={{
                background: 'var(--credit-subtle)',
                color: 'var(--credit)',
                borderColor: 'var(--credit)',
              }}
              disabled={!isAmountValid}
            >
              Confirmar Abono
            </button>
          </div>
        </form>
      </div>
    </IonModal>
  );
};
