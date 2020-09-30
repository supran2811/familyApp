import React, { useState } from 'react';
import { Member } from '../../reducers/group';
import { InferProps } from 'prop-types';
import {
  IonModal,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
} from '@ionic/react';
import CreateForm from '../CreateForm';

interface PropTypes {
  members: Member[];
  addNewMemberAction: (email: string) => void;
}

const Members: React.FC<InferProps<PropTypes>> = ({
  members,
  addNewMemberAction,
}) => {
  const [createNewModal, showCreateNewModal] = useState(false);
  const createAction = (name: string) => {
    addNewMemberAction(name);
    showCreateNewModal(false);
  };

  const renderMembers = () =>
    members.map((member: Member) => (
      <IonItem key={member.name}>
        <IonAvatar slot="start">
          <img src="/assets/avatar.svg" />
        </IonAvatar>
        <IonLabel>{member.name}</IonLabel>
      </IonItem>
    ));

  return (
    <div>
      <IonModal
        isOpen={createNewModal}
        onDidDismiss={() => showCreateNewModal(false)}
        cssClass="modal-small"
      >
        <CreateForm
          title="Enter email id of your family member to add"
          createAction={createAction}
          cancelAction={() => showCreateNewModal(false)}
        />
      </IonModal>
      <IonButton onClick={() => showCreateNewModal(true)}>Add member</IonButton>
      {renderMembers()}
    </div>
  );
};

export default Members;
