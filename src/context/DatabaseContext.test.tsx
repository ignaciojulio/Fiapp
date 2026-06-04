import React, { useContext } from 'react';
import { vi, describe, it, expect } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import { SQLiteProvider, DatabaseContext } from './DatabaseContext';

// Mock de las dependencias nativas de Capacitor SQLite
vi.mock('@capacitor-community/sqlite', () => {
  const mockConnection = {
    open: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    execute: vi.fn<() => Promise<any>>().mockResolvedValue({}),
  };

  return {
    CapacitorSQLite: {},
    SQLiteConnection: vi.fn().mockImplementation(() => ({
      checkConnectionsConsistency: vi.fn().mockResolvedValue({ result: true }),
      isConnection: vi.fn().mockResolvedValue({ result: false }),
      createConnection: vi.fn().mockResolvedValue(mockConnection),
      retrieveConnection: vi.fn().mockResolvedValue(mockConnection),
    })),
  };
});

// Componente auxiliar para leer el estado del Contexto en el test
const ContextConsumer = () => {
  const { isReady, db } = useContext(DatabaseContext);
  return (
    <div>
      <span data-testid="ready-status">{isReady ? 'Ready' : 'Not Ready'}</span>
      <span data-testid="db-status">{db ? 'DB Exists' : 'No DB'}</span>
    </div>
  );
};

describe('Provider: DatabaseContext (SQLiteProvider)', () => {
  it('debe inicializar la base de datos, montar el DDL y cambiar isReady a true', async () => {
    // Act
    render(
      <SQLiteProvider>
        <ContextConsumer />
      </SQLiteProvider>
    );

    // Assert Inicial: El estado por defecto debe ser falso
    expect(screen.getByTestId('ready-status').textContent).toBe('Not Ready');

    // Assert Final: Esperamos a que el useEffect termine su asincronismo
    await waitFor(() =>
      expect(screen.getByTestId('ready-status').textContent).toBe('Ready')
    );
    expect(screen.getByTestId('db-status').textContent).toBe('DB Exists');
  });
});
