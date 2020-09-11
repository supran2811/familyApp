import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonContent, IonText } from '@ionic/react';

import { signUpAction, SignUpPayload } from '../../actions/authActions';
import {
  createNewShoppingAction,
  getShoppingList,
} from '../../actions/shoppingAction';
import Skeleton from '../../components/Skeleton';
import { errors } from '../../selectors/applicationSelector';
import AuthForm from '../../components/AuthForm';

import './Root.css';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';
import Dashboard from '../../components/Dashboard';

const Root: React.FC = () => {
  const dispatch = useDispatch();
  const errorMessages = useSelector(errors);
  const user = useGetCurrentUser();

  useEffect(() => {
    user && dispatch(getShoppingList());
  }, [user]);

  const doSignup = (data: SignUpPayload) => {
    dispatch(signUpAction(data));
  };

  const doCreateNewShopping = (name: string) => {
    dispatch(createNewShoppingAction({ name }));
  };

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
          <Dashboard createNewShoppingAction={doCreateNewShopping} />
        )}
      </IonContent>
    </Skeleton>
  );
};

export default Root;
