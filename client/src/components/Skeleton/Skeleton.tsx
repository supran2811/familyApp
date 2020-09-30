import React from 'react';
import { useDispatch } from 'react-redux';
import { InferProps } from 'prop-types';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonMenuButton,
  IonSplitPane,
  IonMenu,
  IonBackButton,
} from '@ionic/react';

import SideMenu from '../SideMenu';

import { User } from '../../reducers/auth';
import { homeOutline, notifications } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface SkeletonPropType {
  children: React.ReactNode;
  currentUser?: User;
}

const Skeleton: React.FC<InferProps<SkeletonPropType>> = ({
  children,
  currentUser,
}) => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {history.location.pathname !== '/' && (
              <IonBackButton defaultHref="/" />
            )}
            <IonMenuButton />
          </IonButtons>
          <IonTitle>FamilyApp</IonTitle>
          {currentUser && (
            <IonButtons slot="end">
              <IonButton onClick={() => history.push('/notifications')}>
                <IonIcon slot="icon-only" icon={notifications} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSplitPane contentId="main">
          <SideMenu currentUser={currentUser} disabled={false} />
          <IonPage id="main">{children}</IonPage>
        </IonSplitPane>
      </IonContent>
    </IonPage>
  );
};

export default Skeleton;
