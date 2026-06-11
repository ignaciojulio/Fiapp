import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useClients } from '../context/ClientsContext';
import { BottomNav } from '../components/BottomNav';
import { Toggle } from '../components/Toggle'; // Importar el componente Toggle
import {
  Store,
  User,
  Moon,
  Bell,
  Lock,
  Fingerprint,
  Download,
  Trash2,
  ChevronRight,
} from 'lucide-react';

const Divider: React.FC = () => (
  <div
    style={{ height: 1, background: 'var(--border)', marginLeft: '4.5rem' }}
  />
);

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}
const SettingRow: React.FC<SettingRowProps> = ({
  icon: Icon,
  label,
  sublabel,
  right,
  onClick,
  destructive = false,
}) => {
  const rowContent = (
    <>
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: destructive
            ? 'var(--debt-subtle)'
            : 'var(--secondary)',
        }}
      >
        <Icon
          className="h-4 w-4"
          style={{
            color: destructive ? 'var(--debt)' : 'var(--muted-foreground)',
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="font-medium"
          style={{ color: destructive ? 'var(--debt)' : 'var(--foreground)' }}
        >
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {sublabel}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {right ??
          (onClick && (
            <ChevronRight className="h-4 w-4 text-[var(--switch-background)]" />
          ))}
      </div>
    </>
  );

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {rowContent}
    </div>
  );
};

interface SectionCardProps {
  label: string;
  children: React.ReactNode;
}
const SectionCard: React.FC<SectionCardProps> = ({ label, children }) => (
  <section className="mb-5">
    <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
      {label}
    </h2>
    <div className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card)] shadow-sm">
      {children}
    </div>
  </section>
);

export const SettingsScreen: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { isDark, toggle } = useTheme();
  const { clearAll } = useClients();

  const [notifications, setNotifications] = useState(true);
  const [pinLock, setPinLock] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [storeName, setStoreName] = useState('Mi Tienda');
  const [ownerName, setOwnerName] = useState('Juan García');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteAll = () => {
    clearAll();
    setDeleteModalOpen(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col bg-[var(--background)] pb-32">
          <header className="px-5 pb-6 pt-14">
            <p className="mb-1 text-sm font-medium text-[var(--muted-foreground)]">
              Configuración
            </p>
            <h1 className="text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
              Ajustes
            </h1>
          </header>

          <main className="px-5">
            <SectionCard label="Cuenta">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--secondary)]">
                  <Store className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                    Nombre del negocio
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-[var(--foreground)] outline-none"
                  />
                </div>
              </div>
              <Divider />
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--secondary)]">
                  <User className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                    Nombre del dueño
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-[var(--foreground)] outline-none"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard label="Preferencias">
              <SettingRow
                icon={Moon}
                label="Modo oscuro"
                sublabel={isDark ? 'Activado' : 'Desactivado'}
                right={<Toggle enabled={isDark} onChange={toggle} />}
              />
              <Divider />
              <SettingRow
                icon={Bell}
                label="Notificaciones"
                sublabel="Recordatorios de cobro"
                right={
                  <Toggle enabled={notifications} onChange={setNotifications} />
                }
              />
            </SectionCard>

            <SectionCard label="Seguridad">
              <SettingRow
                icon={Lock}
                label="Bloqueo con PIN"
                sublabel="Protege el acceso a la app"
                right={<Toggle enabled={pinLock} onChange={setPinLock} />}
              />
              <Divider />
              <SettingRow
                icon={Fingerprint}
                label="Biometría"
                sublabel="Huella dactilar o Face ID"
                right={<Toggle enabled={biometrics} onChange={setBiometrics} />}
              />
            </SectionCard>

            <SectionCard label="Datos">
              <SettingRow
                icon={Download}
                label="Exportar datos"
                sublabel="Descarga un CSV con todo el historial"
                onClick={() => alert('Exportando datos...')}
              />
              <Divider />
              <SettingRow
                icon={Trash2}
                label="Borrar todos los datos"
                sublabel="Esta acción no se puede deshacer"
                onClick={() => setDeleteModalOpen(true)}
                destructive
              />
            </SectionCard>
          </main>

          <footer className="mb-2 mt-4">
            <p className="text-center text-xs text-[var(--switch-background)]">
              Mi Cartera v1.0.0
            </p>
          </footer>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-5">
            <div className="mx-auto w-full max-w-[300px] rounded-[24px] bg-[var(--card)] p-6 text-center">
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">
                ¿Borrar todo?
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Esta acción eliminará todos los clientes y movimientos. No se
                puede deshacer.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="h-12 flex-1 rounded-2xl bg-[var(--secondary)] font-medium text-[var(--foreground)]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="h-12 flex-1 rounded-2xl bg-[var(--debt)] font-semibold text-white"
                >
                  Borrar todo
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav
          currentPath={location.pathname}
          onNavigate={(path) => history.push(path)}
        />
      </IonContent>
    </IonPage>
  );
};
