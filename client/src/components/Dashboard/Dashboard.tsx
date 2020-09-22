import React, { useState } from 'react';
import { InferProps } from 'prop-types';
import { useHistory } from 'react-router';
import { ItemStatus } from '@familyapp/common';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonButton,
  IonCol,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonList,
  IonIcon,
  IonLabel,
  IonAlert,
  IonText,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import './Dashboard.css';
import CreateForm from '../CreateForm';
import { Shopping } from '../../reducers/shopping';
// import { deleteShoppingByIds } from '../../actions/shoppingAction';

interface DashboardPropTypes {
  createNewShoppingAction: (name: string) => void;
  deleteShoppingList: (id: string) => void;
  shoppinglists: Shopping[];
}

const Dashboard: React.FC<InferProps<DashboardPropTypes>> = ({
  createNewShoppingAction,
  deleteShoppingList,
  shoppinglists,
}) => {
  const [createNewModal, showCreateNewModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [shoppingIdToDelete, setShoppingIdToDelete] = useState('');

  const history = useHistory();

  const createAction = (name: string) => {
    createNewShoppingAction(name);
    showCreateNewModal(false);
  };

  const showAlertToDelete = (id: string) => {
    setShowAlert(true);
    setShoppingIdToDelete(id);
  };

  const dismissAlert = () => {
    setShoppingIdToDelete('');
    setShowAlert(false);
  };

  const renderShoppingContent = (
    items: { _id?: string; name: string; qty: string; status: ItemStatus }[]
  ) => {
    var newItems = items.slice(0, 3);

    const updatedItems = newItems.map((item) => (
      <IonItem key={item.name}>{item.name}</IonItem>
    ));

    if (items.length > updatedItems.length) {
      updatedItems.push(
        <IonItem>
          <IonText color="secondary">
            <h4>View More...</h4>
          </IonText>
        </IonItem>
      );
    }

    return <IonList>{updatedItems}</IonList>;
  };

  const renderShoppingList = () =>
    shoppinglists.map((item: Shopping) => (
      <IonCol
        sizeLg="3"
        sizeXl="2"
        sizeMd="4"
        sizeSm="6"
        sizeXs="12"
        size="12"
        key={item.id}
      >
        <IonCard>
          <IonItem>
            <IonLabel>{item.name}</IonLabel>
            <IonButton
              color="transparent"
              slot="end"
              onClick={() => showAlertToDelete(item.id)}
            >
              <IonIcon icon={trashOutline} color="danger"></IonIcon>
            </IonButton>
          </IonItem>
          <IonCardContent
            className="card-content"
            onClick={() => history.push(`/shopping/${item.id}`)}
          >
            {renderShoppingContent(item.items)}
          </IonCardContent>
        </IonCard>
      </IonCol>
    ));

  return (
    <IonContent>
      <IonAlert
        isOpen={showAlert}
        header={'Remove Shopping List'}
        subHeader={''}
        onDidDismiss={dismissAlert}
        message={'Are you sure you want to delete this?'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: (e) => {},
          },
          {
            text: 'Okay',
            handler: () => {
              console.log('Confirm ok');
              deleteShoppingList(shoppingIdToDelete);
            },
          },
        ]}
      />
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
        <IonRow>{renderShoppingList()}</IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Dashboard;
