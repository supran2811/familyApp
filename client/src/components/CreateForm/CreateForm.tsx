import React, { useState } from 'react';
import { InferProps } from 'prop-types';
import { IonInput, IonButton } from '@ionic/react';

import './CreateForm.css';

interface PropTypes {
  title: string;
  createAction: (name: string) => void;
  cancelAction: () => void;
}

const CreateForm: React.FC<InferProps<PropTypes>> = ({
  title,
  createAction,
  cancelAction,
}) => {
  const [name, setName] = useState('');

  return (
    <div className="model-content">
      <IonInput
        type="text"
        size={10}
        maxlength={40}
        minlength={2}
        color="primary"
        autofocus={true}
        placeholder={title}
        className="inputbox"
        onIonChange={(e) => setName(e.detail.value!)}
      ></IonInput>
      <div className="modal-action">
        <IonButton onClick={() => createAction(name)}>Create</IonButton>
        <IonButton onClick={cancelAction}>Cancel</IonButton>
      </div>
    </div>
  );
};

export default CreateForm;
