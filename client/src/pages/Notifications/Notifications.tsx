import React, { useEffect, useState } from 'react';

import Skeleton from '../../components/Skeleton';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvitations,
  acceptInvitation,
  declineInvitation,
} from '../../actions/groupAction';
import { getInvites } from '../../selectors/groupSelector';
import { Invite } from '../../reducers/group';
import {
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonText,
  IonToast,
} from '@ionic/react';

import './Notifications.css';

const Notifications: React.FC = () => {
  const user = useGetCurrentUser();
  const dispatch = useDispatch();
  const invitations = useSelector(getInvites);
  const [showSucessToast, setShowSucessToast] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  useEffect(() => {
    user && dispatch(fetchInvitations());
  }, []);

  const accept = (id: string) => {
    dispatch(
      acceptInvitation({
        payload: id,
        callback: (response: any) => {
          if (response.errors) {
            setToastMessage(response.errors[0].message);
          } else {
            setToastMessage('Invitation is accepted sucessfully!');
          }
          setShowSucessToast(true);
        },
      })
    );
  };

  const decline = (id: string) => {
    dispatch(
      declineInvitation({
        payload: id,
        callback: (response: any) => {
          if (response.errors) {
            setToastMessage(response.errors[0].message);
          } else {
            setToastMessage('Invitation is declined');
          }
          setShowSucessToast(true);
        },
      })
    );
  };

  const renderInvites = () =>
    invitations.map((invite: Invite) => (
      <IonItem key={invite.id}>
        <div>
          <IonLabel className="ion-text-wrap">
            <IonText>
              You are invited by {invite.senderName} with email id{' '}
              {invite.senderEmail} to join his family group.
            </IonText>
          </IonLabel>
          <div>
            <IonButton onClick={() => accept(invite.id)}>Accept</IonButton>
            <IonButton onClick={() => decline(invite.id)}>Decline</IonButton>
          </div>
        </div>
      </IonItem>
    ));

  return (
    <Skeleton currentUser={user}>
      <IonToast
        isOpen={showSucessToast}
        onDidDismiss={() => setShowSucessToast(false)}
        message={toastMessage}
        duration={200}
      />
      <IonList>{renderInvites()}</IonList>
    </Skeleton>
  );
};

export default Notifications;
