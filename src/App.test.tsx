import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

// Mock global de Capacitor SQLite para evitar errores nativos al renderizar la App
vi.mock('@capacitor-community/sqlite', () => {
  const mockConnection = {
    open: vi.fn().mockResolvedValue(undefined),
    execute: vi.fn().mockResolvedValue({}),
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

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
