import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from './context/ThemeContext';
import { SQLiteProvider } from './infrastructure/db/DatabaseContext';
import { ServicesProvider } from './context/ServicesContext';

import { DashboardScreen } from './pages/DashboardScreen';
import { ClientDetailScreen } from './pages/ClientDetailScreen';
import { SettingsScreen } from './pages/SettingsScreen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => (
  <IonApp>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SQLiteProvider>
          <ServicesProvider>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route exact path="/" component={DashboardScreen} />
                <Route exact path="/client/:clientId" component={ClientDetailScreen} />
                <Route exact path="/settings" component={SettingsScreen} />
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </ServicesProvider>
        </SQLiteProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </IonApp>
);

export default App;