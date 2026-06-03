import React, { useContext } from 'react';
import { jest, describe, it, expect } from '@jest/globals';
import { render, waitFor, screen } from '@testing-library/react';
import { SQLiteProvider, DatabaseContext } from './DatabaseContext';

// Mock de las dependencias nativas de Capacitor SQLite
jest.mock('@capacitor-community/sqlite', () => {
  const mockConnection = {
    open: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    execute: jest.fn<() => Promise<any>>().mockResolvedValue({}),
  };

  return {
    CapacitorSQLite: {},
    SQLiteConnection: jest.fn().mockImplementation(() => ({
      checkConnectionsConsistency: jest.fn().mockResolvedValue(true),
      checkConnectionsConsistency: jest.fn().mockResolvedValue({ result: true }),
      isConnection: jest.fn().mockResolvedValue({ result: false }),
      createConnection: jest.fn().mockResolvedValue(mockConnection),
      retrieveConnection: jest.fn().mockResolvedValue(mockConnection),
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
