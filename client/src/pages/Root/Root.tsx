import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonContent, IonText } from '@ionic/react';

import { signUpAction, SignUpPayload } from '../../actions/authActions';
import Skeleton from '../../components/Skeleton';
import { errors } from '../../selectors/applicationSelector';
import AuthForm from '../../components/AuthForm';

import './Root.css';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';

const Root: React.FC = () => {
  const dispatch = useDispatch();
  const errorMessages = useSelector(errors);
  const user = useGetCurrentUser();

  const doSignup = (data: SignUpPayload) => {
    dispatch(signUpAction(data));
  };
  console.log('asdasd', user);
  return (
    <Skeleton currentUser={user}>
      <IonContent>
        {user === null && (
          <div className="registerForm">
            <IonText color="dark" className="pageTitle">
              <h1>Register</h1>
            </IonText>
            <AuthForm
              isRegister={true}
              redirectPath="/login"
              action={doSignup}
              errors={errorMessages}
            />
          </div>
        )}
        {user !== null && (
          <IonText>
            <h2>You are logged in as {user.name}</h2>
          </IonText>
        )}
      </IonContent>
    </Skeleton>
  );
};

export default Root;
