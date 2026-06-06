import { useState, type FC } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { SQLiteProvider } from './context/DatabaseContext';
import { ErrorBoundary } from './components/ErrorBoundary';
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

const App: FC = () => {
  const [databaseKey, setDatabaseKey] = useState(0);

  const handleDatabaseReset = () => {
    queryClient.resetQueries();
    setDatabaseKey((current) => current + 1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            resetErrorBoundary={reset}
            onReset={handleDatabaseReset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <IonApp>
                <IonContent fullscreen>
                  <div style={{ padding: 24 }}>
                    <h1>Error crítico de base de datos</h1>
                    <p>{error.message}</p>
                    <button onClick={resetErrorBoundary}>Reintentar</button>
                  </div>
                </IonContent>
              </IonApp>
            )}
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
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
};

export default App;
