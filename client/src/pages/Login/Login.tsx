import React, { useEffect } from 'react';
import { InferProps } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { IonContent, IonText } from '@ionic/react';
import { Redirect } from 'react-router-dom';

import Skeleton from '../../components/Skeleton';
import AuthForm from '../../components/AuthForm';
import { errors } from '../../selectors/applicationSelector';
import { signInAction, SignInPayload } from '../../actions/authActions';

import './Login.css';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  // const history = useHistory();
  const user = useGetCurrentUser();
  const errorMessages = useSelector(errors);

  const doSignIn = (data: SignInPayload) => {
    dispatch(signInAction(data));
  };

  return user === null ? (
    <Skeleton>
      <IonContent>
        <div className="registerForm">
          <IonText color="dark" className="pageTitle">
            <h1>Login</h1>
          </IonText>
          <AuthForm
            isRegister={false}
            redirectPath="/"
            action={doSignIn}
            errors={errorMessages}
          />
        </div>
      </IonContent>
    </Skeleton>
  ) : (
    <Redirect to="/" />
  );
};

export default Login;
