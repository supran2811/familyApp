import React, { useState } from 'react';
import {} from 'react-redux';
import { IonInput, IonText } from '@ionic/react';
import { InferProps } from 'prop-types';
import './SwitchTextInput.css';

type IonInputProps = React.ComponentProps<typeof IonInput>;

const SwitchTextInput: React.FC<InferProps<IonInputProps>> = (props) => {
  const [enableInput, setEnableInput] = useState(false);

  return enableInput ? (
    <IonInput
      {...props}
      onIonBlur={() => setEnableInput(false)}
      autofocus={true}
    />
  ) : (
    <IonText
      color="secondary"
      onClick={() => setEnableInput(true)}
      className="text"
    >
      {props.value}
    </IonText>
  );
};

export default SwitchTextInput;
