import { useContext } from 'react';
import { DatabaseContext } from '../infrastructure/db/DatabaseContext';

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a SQLiteProvider');
  }
  return context;
};
