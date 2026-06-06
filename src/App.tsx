import { useState, type FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { SQLiteProvider } from './context/DatabaseContext';
import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Home from './pages/Home';

setupIonicReact();

const queryClient = new QueryClient();

const DatabaseErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => (
  <IonApp>
    <IonContent fullscreen>
      <div style={{ padding: 24 }}>
        <h1>Error en la base de datos</h1>
        <p>{error?.message ?? 'Error al inicializar SQLite'}</p>
        <button onClick={resetErrorBoundary}>Reintentar</button>
      </div>
    </IonContent>
  </IonApp>
);

const App: FC = () => {
  const [databaseKey, setDatabaseKey] = useState(0);

  const handleDatabaseReset = () => {
    queryClient.resetQueries();
    setDatabaseKey((current) => current + 1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={DatabaseErrorFallback}
        onReset={handleDatabaseReset}
        resetKeys={[databaseKey]}
      >
        <SQLiteProvider key={databaseKey}>
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </SQLiteProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
