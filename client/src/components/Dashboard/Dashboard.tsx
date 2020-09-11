import React, { useState } from 'react';
import { InferProps } from 'prop-types';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonButton,
  IonCol,
  IonModal,
} from '@ionic/react';
import './Dashboard.css';
import CreateForm from '../CreateForm';

interface DashboardPropTypes {
  createNewShoppingAction: (name: string) => void;
}

const Dashboard: React.FC<InferProps<DashboardPropTypes>> = ({
  createNewShoppingAction,
}) => {
  const [createNewModal, showCreateNewModal] = useState(false);

  const createAction = (name: string) => {
    createNewShoppingAction(name);
    showCreateNewModal(false);
  };

  return (
    <IonContent>
      <IonModal
        isOpen={createNewModal}
        onDidDismiss={() => showCreateNewModal(false)}
        cssClass="modal-small"
      >
        <CreateForm
          title="Enter name of shopping list"
          createAction={createAction}
          cancelAction={() => showCreateNewModal(false)}
        />
      </IonModal>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton onClick={() => showCreateNewModal(true)}>
              Create New Shopping List
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Dashboard;
