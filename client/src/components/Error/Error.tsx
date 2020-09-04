import { IonList, IonItem, IonText } from '@ionic/react';
import { InferProps } from 'prop-types';
import React from 'react';

interface ErrorPropType {
  errors?: { message: string }[];
}

const Error: React.FC<InferProps<ErrorPropType>> = ({ errors }) => {
  return errors ? (
    <IonList>
      {errors.map((err: { message: string }) => (
        <IonItem key={err.message}>
          <IonText color="danger">{err.message}</IonText>
        </IonItem>
      ))}
    </IonList>
  ) : null;
};

export default Error;
