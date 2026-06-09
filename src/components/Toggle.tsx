import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(!enabled);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!enabled);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={enabled}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative h-7 w-12 flex-shrink-0 cursor-pointer select-none rounded-full transition-colors duration-200 ease-in-out ${
        enabled ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
      }`}
    >
      <span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out"
        style={{ left: enabled ? 'calc(100% - 24px)' : '4px' }}
      />
    </div>
  );
};
