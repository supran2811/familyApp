import React, { useState, KeyboardEvent } from 'react';
import { InferProps } from 'prop-types';
import { ItemStatus } from '@familyapp/common';
import { Shopping } from '../../reducers/shopping';
import {
  IonItem,
  IonButton,
  IonIcon,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import {
  thumbsDown,
  thumbsUp,
  thumbsUpOutline,
  thumbsDownOutline,
} from 'ionicons/icons';

import './ShoppingListForm.css';
import SwitchTextInput from '../SwitchTextInput/SwitchTextInput';

interface PropTypes {
  shoppingList: Shopping;
  updateShoppingList: (updatedShopping: Shopping) => void;
}

const ShoppingListForm: React.FC<InferProps<PropTypes>> = ({
  shoppingList,
  updateShoppingList,
}) => {
  const [itemtoAdd, setItemtoAdd] = useState('');
  const [updatedShoppingList, setUpdatedShoppingList] = useState(shoppingList);

  const addItem = (e: KeyboardEvent<HTMLIonInputElement>) => {
    if (e.which === 13) {
      if (itemtoAdd.trim().length > 0) {
        const [name, qty = ''] = itemtoAdd.split('-');
        const newItem = { name, qty, status: 'pending' };
        const newShoppingList = { ...updatedShoppingList };
        newShoppingList.items = [newItem, ...updatedShoppingList.items];
        setUpdatedShoppingList(newShoppingList);
        setItemtoAdd('');
      }
    }
  };

  const updateName = (newValue: string) => {
    const newUpdatedShoppingList = {
      ...updatedShoppingList,
      name: newValue,
    };

    setUpdatedShoppingList(newUpdatedShoppingList);
  };

  const addItemsToShoppingList = () => {
    updateShoppingList(updatedShoppingList);
  };

  const updateItemName = (key: string, newValue: string, index: number) => {
    const updatedItems = [...updatedShoppingList.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: newValue,
    };
    const newUpdatedShoppingList = {
      ...updatedShoppingList,
      items: updatedItems,
    };
    setUpdatedShoppingList(newUpdatedShoppingList);
  };

  const updateItemStatus = (
    key: string,
    currentStatus: ItemStatus,
    index: number
  ) => {
    const updatedItems = [...updatedShoppingList.items];

    let updatedStatus = currentStatus;

    if (key === 'thumbsUp') {
      if (updatedStatus === ItemStatus.PENDING) {
        updatedStatus = ItemStatus.DONE;
      } else {
        updatedStatus = ItemStatus.PENDING;
      }
    } else {
      if (updatedStatus === ItemStatus.PENDING) {
        updatedStatus = ItemStatus.MISSING;
      } else {
        updatedStatus = ItemStatus.PENDING;
      }
    }

    updatedItems[index] = {
      ...updatedItems[index],
      status: updatedStatus,
    };
    const newUpdatedShoppingList = {
      ...updatedShoppingList,
      items: updatedItems,
    };
    setUpdatedShoppingList(newUpdatedShoppingList);
  };

  const renderItems = () =>
    updatedShoppingList.items.map(
      (
        item: { _id?: string; name: string; qty: string; status: ItemStatus },
        index: number
      ) => (
        <IonRow key={item._id || item.name}>
          <IonCol sizeXl="1" size="2">
            <IonButton
              color="transparent"
              size="small"
              onClick={(e) => updateItemStatus('thumbsUp', item.status, index)}
              disabled={item.status === ItemStatus.MISSING}
            >
              <IonIcon
                slot="icon-only"
                icon={
                  item.status === ItemStatus.PENDING ||
                  item.status === ItemStatus.MISSING
                    ? thumbsUpOutline
                    : thumbsUp
                }
              />
            </IonButton>
          </IonCol>
          <IonCol sizeXl="1" size="2">
            <IonButton
              color="transparent"
              size="small"
              onClick={(e) =>
                updateItemStatus('thumbsDown', item.status, index)
              }
              disabled={item.status === ItemStatus.DONE}
            >
              <IonIcon
                slot="icon-only"
                icon={
                  item.status === ItemStatus.PENDING ||
                  item.status === ItemStatus.DONE
                    ? thumbsDownOutline
                    : thumbsDown
                }
              />
            </IonButton>
          </IonCol>
          <IonCol sizeXl="6" size="5">
            <SwitchTextInput
              value={item.name}
              type="text"
              maxlength={20}
              className="item-name-input"
              onIonChange={(e: CustomEvent) =>
                updateItemName('name', e.detail.value!, index)
              }
            />
          </IonCol>
          <IonCol sizeXl="4" size="3">
            <SwitchTextInput
              value={item.qty}
              type="text"
              maxlength={5}
              className="item-name-input"
              onIonChange={(e: CustomEvent) =>
                updateItemName('qty', e.detail.value!, index)
              }
            />
          </IonCol>
        </IonRow>
      )
    );

  return (
    <div className="form">
      <div className="form-title">
        <SwitchTextInput
          maxlength={40}
          autoCapitalize="on"
          value={updatedShoppingList.name}
          type="text"
          onIonChange={(e: CustomEvent) => updateName(e.detail.value!)}
          className="name-input"
        />
        <IonButton onClick={addItemsToShoppingList}>Done</IonButton>
      </div>
      <div className="add-item-container">
        <IonInput
          maxlength={40}
          autoCapitalize="on"
          autocomplete="on"
          placeholder="Enter item to add"
          type="text"
          value={itemtoAdd}
          autofocus
          onIonChange={(e: CustomEvent) => setItemtoAdd(e.detail.value!)}
          onKeyPress={addItem}
          className="additem-input"
        />
      </div>

      <IonGrid>{renderItems()}</IonGrid>
    </div>
  );
};

export default ShoppingListForm;
