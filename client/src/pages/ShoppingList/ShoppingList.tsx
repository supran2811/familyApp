import React, { useEffect, useState } from 'react';
import { InferProps } from 'prop-types';
import { IonContent } from '@ionic/react';
import { isEqual } from 'lodash';

import { selectShoppingListById } from '../../selectors/shoppingSelector';
import Skeleton from '../../components/Skeleton';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers';
import { Shopping } from '../../reducers/shopping';
import {
  getShoppingListById,
  updateShoppingById,
} from '../../actions/shoppingAction';
import ShoppingListForm from '../../components/ShoppingListForm';
import { useHistory } from 'react-router';

import './ShoppingList.css';

interface ShoppingPropType {
  match: { params: { id: string } };
}

const ShoppingList: React.FC<InferProps<ShoppingPropType>> = ({ match }) => {
  const { id } = match.params;
  const dispatch = useDispatch();
  const history = useHistory();
  //   const [updating, setUpdating] = useState(false);

  const shoppingList = useSelector((state: RootState) =>
    selectShoppingListById(id, state)
  );

  const addItemsToShoppingList = (updatedShoppingList: Shopping) => {
    dispatch(updateShoppingById({ shopping: updatedShoppingList, history }));
  };

  const user = useGetCurrentUser();

  useEffect(() => {
    if (!shoppingList && id) {
      dispatch(getShoppingListById(id));
    }
  }, [shoppingList]);

  return shoppingList ? (
    <Skeleton currentUser={user}>
      <div className="content">
        <ShoppingListForm
          shoppingList={shoppingList}
          updateShoppingList={addItemsToShoppingList}
        />
      </div>
    </Skeleton>
  ) : null;
};

export default ShoppingList;
