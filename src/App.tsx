import type { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SQLiteProvider } from './context/DatabaseContext';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Home from './pages/Home';

setupIonicReact();

const queryClient = new QueryClient();

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <SQLiteProvider>
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
  </QueryClientProvider>
);

export default App;
