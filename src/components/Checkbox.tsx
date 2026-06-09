import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
}) => {
  return (
    <div className="flex cursor-pointer items-start gap-3">
      <button
        id={id}
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked
            ? 'border-[var(--primary)] bg-[var(--primary)]'
            : 'border-[var(--switch-background)] bg-transparent'
        }`}
      >
        {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
      </button>
      <label htmlFor={id} className="text-sm text-[var(--muted-foreground)]">
        {label}
      </label>
    </div>
  );
};
