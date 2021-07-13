import React from "react";
import { Route, Redirect } from "react-router-dom";
import useStoreContext from "../store";

const PublicRoute = (props) => {
  const { component: Component, ...rest } = props;
  const { state } = useStoreContext();
  const isUserAuthenticated = state.isAuthenticated;
  const location = {
    pathname: "/home",
  };
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isUserAuthenticated) {
          return <Redirect to={location} />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
