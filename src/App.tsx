import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { ThemeProvider } from './context/ThemeContext';
import { ClientsProvider } from './context/ClientsContext';

import { DashboardScreen } from './pages/DashboardScreen';
import { ClientDetailScreen } from './pages/ClientDetailScreen';
import { SettingsScreen } from './pages/SettingsScreen';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <ThemeProvider>
      <ClientsProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={DashboardScreen} />
            <Route
              exact
              path="/client/:clientId"
              component={ClientDetailScreen}
            />
            <Route exact path="/settings" component={SettingsScreen} />
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </ClientsProvider>
    </ThemeProvider>
  </IonApp>
);

export default App;
