import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonFooter, IonToolbar } from '@ionic/react';
import { ArrowLeft, Phone, Calendar, Plus, Minus } from 'lucide-react';
import { formatCOP } from '../utils/formatCOP';
import { TransactionItem } from '../components/TransactionItem';
import { useClients } from '../context/ClientsContext';
import { FiarBottomSheet } from '../components/FiarBottomSheet';
import { AbonarBottomSheet } from '../components/AbonarBottomSheet';

export const ClientDetailScreen: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { getClientById, addTransaction, isLoading } = useClients();

  const [isFiarOpen, setFiarOpen] = useState(false);
  const [isAbonarOpen, setAbonarOpen] = useState(false);

  const client = getClientById(clientId || '');

  useEffect(() => {
    // Si después de cargar, el cliente no existe, volver al inicio.
    if (!isLoading && !client) {
      navigate('/', { replace: true });
    }
  }, [isLoading, client, navigate]);

  if (isLoading || !client) {
    return (
      <IonPage>
        <IonContent>
          <div className="flex h-full items-center justify-center">
            <p>Cargando...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  const sinceDate = new Date(client.createdAt).toLocaleDateString('es-CO', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col bg-[var(--background)] pb-36">
          {/* 1. HEADER (back button) */}
          <header className="flex items-center gap-3 px-5 pb-4 pt-14">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card)]"
              onClick={() => navigate('/')}
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--foreground)]" />
            </button>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              Detalle de cliente
            </p>
          </header>

          <main>
            {/* 2. TARJETA DE PERFIL */}
            <section className="mx-5 mb-4 rounded-[24px] bg-[var(--card)] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-subtle)]">
                  <span className="text-xl font-semibold text-[var(--primary)]">
                    {getInitials(client.name)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="mb-1 text-[22px] font-semibold tracking-tight text-[var(--foreground)]">
                    {client.name}
                  </h1>
                  {client.phone && (
                    <div className="mb-3 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {client.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    <span className="text-xs capitalize text-[var(--muted-foreground)]">
                      Cliente desde {sinceDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t-[1px] border-[var(--border)] pt-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                  Deuda total actual
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[34px] font-bold leading-none tracking-tight text-[var(--debt)]">
                    {formatCOP(client.balance)}
                  </p>
                  {client.balance > 0 && (
                    <span className="rounded-full bg-[var(--debt-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--debt)]">
                      Debe
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* 3. HISTORIAL DE MOVIMIENTOS */}
            <section className="px-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                Historial de movimientos
              </h2>
              <div className="space-y-3">
                {client.transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    date={new Date(transaction.createdAt).toLocaleDateString(
                      'es-CO',
                      { day: 'numeric', month: 'long' }
                    )}
                    description={transaction.description}
                    amount={transaction.amount}
                    type={transaction.type === 'DEUDA' ? 'debit' : 'credit'}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      </IonContent>

      {/* Modales */}
      <FiarBottomSheet
        isOpen={isFiarOpen}
        onClose={() => setFiarOpen(false)}
        clientName={client.name}
        onSave={({ amount, description }) =>
          addTransaction(client.id, { amount, description, type: 'DEUDA' })
        }
      />
      <AbonarBottomSheet
        isOpen={isAbonarOpen}
        onClose={() => setAbonarOpen(false)}
        clientName={client.name}
        currentDebt={client.balance}
        onSave={({ amount, description }) =>
          addTransaction(client.id, { amount, description, type: 'ABONO' })
        }
      />

      {/* 4. FOOTER FIJO (acciones) */}
      <IonFooter>
        <IonToolbar>
          <div className="mx-auto w-full max-w-[393px]">
            <div className="flex gap-3 px-5 py-4">
              <button
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-[17px] font-semibold text-[var(--primary-foreground)] transition-all active:scale-[0.98]"
                onClick={() => setFiarOpen(true)}
              >
                <Plus className="h-5 w-5" />
                Fiar
              </button>
              <button
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-[1.5px] border-[var(--credit)] bg-[var(--credit-subtle)] text-[17px] font-semibold text-[var(--credit)] transition-all active:scale-[0.98]"
                onClick={() => setAbonarOpen(true)}
              >
                <Minus className="h-5 w-5" />
                Abonar
              </button>
            </div>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
