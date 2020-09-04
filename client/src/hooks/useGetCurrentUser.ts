import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { getCurrentUser } from '../actions/authActions';
import { currentUser } from '../selectors/authSelector';

const useGetCurrentUser = () => {
  const user = useSelector(currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, []);

  return user;
};

export default useGetCurrentUser;
