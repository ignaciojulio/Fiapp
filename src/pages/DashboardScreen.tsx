import React, { useState, useMemo } from 'react';
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useClients } from '../context/ClientsContext';
import { formatCOP } from '../utils/formatCOP';
import { ClientListItem } from '../components/ClientListItem';
import { NewClientBottomSheet } from '../components/NewClientBottomSheet';
import { BottomNav } from '../components/BottomNav';

export const DashboardScreen: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { clients, isLoading, addClient } = useClients();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewClientOpen, setNewClientOpen] = useState(false);

  // Datos financieros (mockeados según especificación)
  const payables = 125000;
  const monthlyIn = 84000;
  const monthlyOut = 32000;

  const { receivable, netBalance, isPositive, filteredClients } =
    useMemo(() => {
      const receivable = clients.reduce(
        (sum, client) => sum + client.balance,
        0
      );
      const netBalance = receivable - payables;
      const isPositive = netBalance >= 0;
      const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { receivable, netBalance, isPositive, filteredClients };
    }, [clients, searchQuery]);

  const handleAddClient = async (data: {
    name: string;
    phone: string;
    habeas_data_flag: boolean;
  }) => {
    await addClient(data);
  };

  const renderClientList = () => {
    if (isLoading) {
      return (
        <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">
          Cargando clientes...
        </p>
      );
    }
    if (clients.length === 0) {
      return (
        <div className="py-10 text-center">
          <Users
            className="mx-auto mb-4 h-16 w-16 text-[var(--muted)]"
            strokeWidth={1.5}
          />
          <p className="font-semibold text-[var(--foreground)]">
            Aún no tienes clientes
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Agrega tu primer cliente con el botón +
          </p>
        </div>
      );
    }
    if (filteredClients.length === 0) {
      return (
        <div className="py-10 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            No se encontraron clientes
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => history.push(`/client/${client.id}`)}
          >
            <ClientListItem
              name={client.name}
              amount={client.balance}
              lastDate={
                client.transactions.length > 0
                  ? new Date(
                      client.transactions[0].createdAt
                    ).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col pb-32">
          {/* HEADER */}
          <header className="px-5 pb-5 pt-14">
            <p className="mb-1 text-sm font-medium text-[var(--muted-foreground)]">
              Bienvenido
            </p>
            <h1 className="text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
              Mi Cartera
            </h1>
          </header>

          <main>
            {/* TARJETA RESUMEN FINANCIERO */}
            <section className="mx-5 mb-5 overflow-hidden rounded-[24px] bg-[var(--card)] shadow-sm">
              <div className="px-6 pb-5 pt-6">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                  Balance Total
                </p>
                <p
                  className="text-[44px] font-bold leading-none tracking-tight"
                  style={{
                    color: isPositive ? 'var(--credit)' : 'var(--debt)',
                  }}
                >
                  {netBalance < 0 ? '-' : ''}
                  {formatCOP(Math.abs(netBalance))}
                </p>
              </div>
              <div
                className="mx-6 h-[1px]"
                style={{ background: 'var(--border)' }}
              />
              <div className="grid grid-cols-3 gap-2 px-6 py-5">
                <div>
                  <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
                    Por cobrar
                  </p>
                  <p className="text-[16px] font-bold text-[var(--credit)]">
                    {formatCOP(receivable)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
                    Por pagar
                  </p>
                  <p className="text-[16px] font-bold text-[var(--debt)]">
                    {formatCOP(payables)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
                    Clientes
                  </p>
                  <p className="text-[16px] font-bold text-[var(--primary)]">
                    {clients.length}
                  </p>
                </div>
              </div>
              <div
                className="h-[1px]"
                style={{ background: 'var(--border)' }}
              />
              <div className="space-y-3 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--credit-subtle)]">
                      <TrendingUp className="h-4 w-4 text-[var(--credit)]" />
                    </div>
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">
                      Cobrado este mes
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[var(--credit)]">
                    +{formatCOP(monthlyIn)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--debt-subtle)]">
                      <TrendingDown className="h-4 w-4 text-[var(--debt)]" />
                    </div>
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">
                      Pagado este mes
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[var(--debt)]">
                    -{formatCOP(monthlyOut)}
                  </span>
                </div>
              </div>
            </section>

            {/* BARRA DE BÚSQUEDA */}
            <section className="mx-5 mb-5">
              <div className="flex h-12 items-center gap-3 rounded-full bg-[var(--card)] px-4 shadow-sm">
                <Search className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none"
                />
              </div>
            </section>

            {/* LISTA DE CLIENTES */}
            <section className="px-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                Clientes con deuda
              </h2>
              {renderClientList()}
            </section>
          </main>
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="m-4">
          <IonFabButton
            onClick={() => setNewClientOpen(true)}
            className="transition-transform active:scale-95"
          >
            <IonIcon
              icon="/assets/icons/plus.svg"
              className="text-[var(--primary-foreground)]"
            />
          </IonFabButton>
        </IonFab>

        <NewClientBottomSheet
          isOpen={isNewClientOpen}
          onClose={() => setNewClientOpen(false)}
          onSave={handleAddClient}
        />

        <BottomNav
          currentPath={location.pathname}
          onNavigate={(path) => history.push(path)}
        />
      </IonContent>
    </IonPage>
  );
};
