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
} from '@ionic/react';

import { signOutAction } from '../../actions/authActions';
import { User } from '../../reducers/auth';

interface SkeletonPropType {
  childred: React.ReactNode;
  currentUser?: User;
}

const Skeleton: React.FC<InferProps<SkeletonPropType>> = ({
  children,
  currentUser,
}) => {
  const dispatch = useDispatch();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {currentUser && (
            <>
              <IonButtons slot="start"></IonButtons>
              <IonButtons slot="end">
                <IonButton onClick={() => dispatch(signOutAction())}>
                  Signout
                </IonButton>
              </IonButtons>
            </>
          )}

          <IonTitle>FamilyApp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>{children}</IonContent>
    </IonPage>
  );
};

export default Skeleton;
