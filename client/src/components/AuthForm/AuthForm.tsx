import React, { useState, FormEvent } from 'react';
import { InferProps } from 'prop-types';
import { Link } from 'react-router-dom';
import {
  IonInput,
  IonItem,
  IonButton,
  IonRouterLink,
  IonText,
  IonList,
} from '@ionic/react';

import './AuthForm.css';
import { SignUpPayload } from '../../actions/authActions';
import Error from '../Error/Error';
interface PropType {
  isRegister: boolean;
  redirectPath: string;
  action: (data: SignUpPayload) => void;
  errors?: [{ message: string }];
}

const AuthForm: React.FC<InferProps<PropType>> = ({
  isRegister = false,
  redirectPath = '/',
  action,
  errors,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('sending request ', name, email, password);
    action({ name, email, password });
  };

  return (
    <form onSubmit={onSubmit} className="formSize">
      {isRegister && (
        <IonItem className="form-input">
          <IonInput
            type="text"
            placeholder="Enter name"
            maxlength={10}
            onIonChange={(e) => setName(e.detail.value!)}
          ></IonInput>
        </IonItem>
      )}
      <IonItem className="form-input">
        <IonInput
          type="email"
          placeholder="Enter email"
          onIonChange={(e) => setEmail(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonItem className="form-input">
        <IonInput
          type="password"
          placeholder="Enter password"
          maxlength={20}
          onIonChange={(e) => setPassword(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <Error errors={errors} />
      <IonButton color="primary" type="submit">
        {isRegister ? 'Register' : 'Login'}
      </IonButton>
      <IonRouterLink color="secondary">
        <Link to={redirectPath}>
          {isRegister ? 'Click here to login' : 'Click here to register'}
        </Link>
      </IonRouterLink>
    </form>
  );
};

export default AuthForm;
