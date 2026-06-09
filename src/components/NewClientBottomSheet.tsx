import React, { useState, FormEvent, useEffect } from 'react';
import { IonModal } from '@ionic/react';
import { X } from 'lucide-react';
import { FloatingLabelInput } from './FloatingLabelInput';
import { Checkbox } from './Checkbox';

interface NewClientBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    phone: string;
    habeas_data_flag: boolean;
  }) => void;
}

export const NewClientBottomSheet: React.FC<NewClientBottomSheetProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [habeasData, setHabeasData] = useState(false);

  const resetForm = () => {
    setName('');
    setPhone('');
    setHabeasData(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave({
        name: name.trim(),
        phone: phone.trim(),
        habeas_data_flag: habeasData,
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

  const isFormValid = name.trim().length > 0 && habeasData;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.75}
      breakpoints={[0, 0.75, 1]}
      handleBehavior="cycle"
    >
      <div className="mx-auto flex h-full w-full max-w-[393px] flex-col rounded-t-[32px] bg-[var(--card)]">
        {/* Drag handle */}
        <div className="flex justify-center pb-2 pt-4">
          <div className="h-1.5 w-10 rounded-full bg-[var(--muted)]" />
        </div>
        <div className="flex flex-shrink-0 items-center justify-between border-b-[1px] border-[var(--border)] px-6 py-4">
          <h2 className="text-[22px] font-semibold text-[var(--foreground)]">
            Nuevo Cliente
          </h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)]"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-grow flex-col p-6">
          <div className="space-y-5">
            <FloatingLabelInput
              label="Nombre completo"
              id="new-client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
            <FloatingLabelInput
              label="Teléfono (opcional)"
              id="new-client-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div
            className="my-6 h-[1px]"
            style={{ background: 'var(--border)' }}
          />

          <Checkbox
            id="habeas-data"
            checked={habeasData}
            onChange={setHabeasData}
            label={
              <>
                Autorizo el almacenamiento y tratamiento de los datos de este
                cliente conforme a la ley de Habeas Data, para uso exclusivo
                dentro de esta aplicación.
              </>
            }
          />

          <div className="mt-auto pt-6">
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--primary)] text-[17px] font-semibold text-[var(--primary-foreground)] transition-all active:scale-[0.98] disabled:opacity-40"
              disabled={!isFormValid}
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </IonModal>
  );
};
