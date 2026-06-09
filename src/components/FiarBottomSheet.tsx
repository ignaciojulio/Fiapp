import React, { useState, FormEvent, useEffect } from 'react';
import { IonModal } from '@ionic/react';
import { X, User } from 'lucide-react';
import { FloatingLabelInput } from './FloatingLabelInput';

interface FiarBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  onSave: (data: { amount: number; description: string }) => void;
}

export const FiarBottomSheet: React.FC<FiarBottomSheetProps> = ({
  isOpen,
  onClose,
  clientName,
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
        description: description.trim() || 'Fiado',
      });
      resetForm();
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const isAmountValid = Number(amount) > 0;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.65}
      breakpoints={[0, 0.65, 1]}
      handleBehavior="cycle"
    >
      <div className="mx-auto flex h-full w-full max-w-[393px] flex-col rounded-t-[32px] bg-[var(--card)]">
        {/* Drag handle */}
        <div className="flex justify-center pb-2 pt-4">
          <div className="h-1.5 w-10 rounded-full bg-[var(--muted)]" />
        </div>

        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b-[1px] border-[var(--border)] px-6 py-4">
          <h2 className="text-[22px] font-semibold text-[var(--foreground)]">
            Registrar Fiado
          </h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)]"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Formulario y contenido */}
        <form onSubmit={handleSubmit} className="flex flex-grow flex-col p-6">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium"
            style={{ background: 'var(--debt-subtle)', color: 'var(--debt)' }}
          >
            <User className="h-3.5 w-3.5" />
            Fiando a {clientName}
          </div>

          {/* Campo "Monto" */}
          <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
            Monto a fiar
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

          {/* Separador */}
          <div
            className="my-5 h-[1px]"
            style={{ background: 'var(--border)' }}
          />

          {/* Campo "Descripción" */}
          <FloatingLabelInput
            label="Descripción (opcional)"
            id="fiar-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />

          {/* Botón submit */}
          <div className="mt-auto pt-6">
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--primary)] text-[17px] font-semibold text-[var(--primary-foreground)] transition-all active:scale-[0.98] disabled:opacity-40"
              disabled={!isAmountValid}
            >
              Confirmar Fiado
            </button>
          </div>
        </form>
      </div>
    </IonModal>
  );
};
