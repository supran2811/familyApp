import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { InferProps } from 'prop-types';
import { useHistory } from 'react-router-dom';

import './SideMenu.css';
import { User } from '../../reducers/auth';
import { signOutAction } from '../../actions/authActions';
import { useDispatch } from 'react-redux';
import { AsyncThunk } from '@reduxjs/toolkit';

interface PropTypes {
  disabled: boolean;
  currentUser?: User;
}

const SideMenu: React.FC<InferProps<PropTypes>> = ({
  disabled,
  currentUser,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const menuList: {
    label: string;
    href?: string;
    action?: any;
  }[] = currentUser
    ? [
        { label: 'Members', href: '/' },
        { label: 'Signout', action: signOutAction },
      ]
    : [{ label: 'Signin', href: '/login' }];

  const renderMenuList = () => {
    return menuList.map(({ label, href, action }) => {
      return (
        <IonMenuToggle key={label} autoHide={false}>
          <IonItem
            button={href || action}
            onClick={() =>
              (href && history.push(href)) ||
              (action && dispatch(action())) ||
              {}
            }
          >
            <IonLabel>{label}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      );
    });
  };

  return (
    <IonMenu contentId="main" disabled={disabled} className="custom-menu">
      <IonContent className="content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>{renderMenuList()}</IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
