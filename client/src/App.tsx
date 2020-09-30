import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IonApp, IonLoading, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import Root from './pages/Root';
import Login from './pages/Login';
import { loading } from './selectors/applicationSelector';
import ShoppingList from './pages/ShoppingList';
import MemberList from './pages/MemberList';
import ProtectedRoute from './hoc/ProtectedRoute';
import Notifications from './pages/Notifications';

const App: React.FC = () => {
  const isLoading = useSelector(loading);

  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/" render={() => <Root />} />
        <ProtectedRoute path="/members" component={MemberList} />
        <ProtectedRoute path="/shopping/:id" component={ShoppingList} />
        <ProtectedRoute path="/notifications" component={Notifications} />
        <Route path="/login" component={Login} />
      </IonReactRouter>
      <IonLoading isOpen={isLoading} message={'Please wait...'} />
    </IonApp>
  );
};

export default App;
