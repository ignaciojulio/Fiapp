import React from 'react';
import { Home, Settings } from 'lucide-react';

interface BottomNavProps {
  /**
   * La ruta actual para determinar qué tab está activa.
   * Se asume que se obtiene de `window.location.pathname` o un hook de Ionic.
   */
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPath,
  onNavigate,
}) => {
  const tabs = [
    { path: '/', label: 'Inicio', Icon: Home },
    { path: '/settings', label: 'Ajustes', Icon: Settings },
  ];

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'var(--nav-backdrop)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)', // Para compatibilidad con Safari
        borderTop: '1px solid var(--nav-border)',
      }}
    >
      <nav className="mx-auto flex h-full max-w-[393px]">
        {tabs.map(({ path, label, Icon }) => {
          const isActive = currentPath === path;
          const iconColor = isActive
            ? 'var(--primary)'
            : 'var(--switch-background)';
          const strokeWidth = isActive ? 2.2 : 1.8;

          return (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              className="flex flex-1 flex-col items-center gap-1 py-3"
              style={{ color: iconColor }}
            >
              <Icon
                className="h-6 w-6 transition-colors"
                strokeWidth={strokeWidth}
              />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};
