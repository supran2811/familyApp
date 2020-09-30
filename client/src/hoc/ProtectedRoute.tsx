import React, { useEffect } from 'react';
import { Route, Redirect, RouteProps, RedirectProps } from 'react-router-dom';
import { InferProps, exact } from 'prop-types';
import useGetCurrentUser from '../hooks/useGetCurrentUser';

interface PropTypes {
  exact?: boolean;
  path: string;
  component: React.FC;
}

const ProtectedRoute: React.FC<InferProps<PropTypes>> = ({
  exact = false,
  path,
  component,
}) => {
  const user = useGetCurrentUser();
  return user ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to="/" />
  );
};

export default ProtectedRoute;
