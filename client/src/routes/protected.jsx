import React from "react";
import { Route, Redirect } from "react-router-dom";
import useStoreContext from "../store";

const ProtectedRoute = (props) => {
  const { component: Component, ...rest } = props;
  const { state } = useStoreContext();
  const isUserAuthenticated = state.isAuthenticated;
  const location = {
    pathname: "/signin",
  };
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isUserAuthenticated) {
          return <Component {...props} />;
        } else {
          return <Redirect to={location} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
