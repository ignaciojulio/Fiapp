import React, { useState, type InputHTMLAttributes } from 'react';

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue =
    value !== undefined && value !== null && String(value).length > 0;

  const showFloatingLabel = isFocused || hasValue;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full rounded-2xl border-2 bg-[var(--input-background)] px-4 pb-2 pt-6 text-[var(--foreground)] outline-none transition-colors duration-200 ease-in-out ${
          isFocused ? 'border-[var(--primary)]' : 'border-transparent'
        }`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 text-[var(--muted-foreground)] transition-all duration-200 ease-in-out ${
          showFloatingLabel
            ? 'top-2 text-xs'
            : 'top-1/2 -translate-y-1/2 text-base'
        }`}
      >
        {label}
      </label>
    </div>
  );
};
