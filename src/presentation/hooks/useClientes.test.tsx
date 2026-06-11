import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClientes } from '../hooks/useClientes';
import { useCreateCliente } from '../hooks/useCreateCliente';
import * as dbContext from './useDatabase';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

// Mockeamos el hook que consume el contexto de la base de datos
vi.mock('./useDatabase');

describe('Hook: useClientes', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Instanciamos un nuevo QueryClient para cada test, aislando la caché
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('no debe ejecutar la consulta si la base de datos no está lista (enabled: false)', () => {
    // Arrange: Simulamos que la DB no está lista
    vi.spyOn(dbContext, 'useDatabase').mockReturnValue({
      db: null,
      isReady: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useClientes(), { wrapper });

    // Assert: El status de fetch debe quedarse en 'idle' gracias a `enabled: isReady`
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('debe ejecutar la consulta y retornar los clientes cuando la DB está lista', async () => {
    // Arrange: Simulamos una DB lista con datos
    const mockDb = {
      query: vi.fn<any[], Promise<any>>().mockResolvedValue({
        values: [{ id: 1, nombre: 'Juan Perez' }],
      }),
    } as unknown as SQLiteDBConnection;

    vi.spyOn(dbContext, 'useDatabase').mockReturnValue({
      db: mockDb,
      isReady: true,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useClientes(), { wrapper });

    // Assert: Esperamos a que la petición sea exitosa
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([{ id: 1, nombre: 'Juan Perez' }]);
    expect(mockDb.query).toHaveBeenCalledWith(
      'SELECT * FROM clientes ORDER BY created_at DESC;'
    );
  });

  it('debe ejecutar la mutación de creación y invalidar la consulta de clientes', async () => {
    const mockDb = {
      run: vi.fn<any[], Promise<any>>().mockResolvedValue({ changes: 1 }),
    } as unknown as SQLiteDBConnection;

    vi.spyOn(dbContext, 'useDatabase').mockReturnValue({
      db: mockDb,
      isReady: true,
      error: null,
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useCreateCliente(), { wrapper });

    await result.current.mutateAsync({
      nombre: 'Ana Gómez',
      telefono: '+5491123456789',
      habeas_data_accepted: true,
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      'INSERT INTO clientes (nombre, telefono, habeas_data_accepted) VALUES (?, ?, ?);',
      ['Ana Gómez', '+5491123456789', 1]
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['clientes'],
      exact: true,
    });
  });
});
