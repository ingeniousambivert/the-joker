import React, { Fragment } from "react";
import { Switch } from "react-router-dom";

import Landing from "../pages/landing";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import Home from "../pages/home";

import ProtectedRoute from "./protected";
import PublicRoute from "./public";

const Routes = () => {
  return (
    <Fragment>
      <Switch>
        <PublicRoute
          exact
          path="/"
          component={(props) => <Landing {...props} />}
        />
        <PublicRoute
          exact
          path="/signup"
          component={(props) => <Signup {...props} />}
        />
        <PublicRoute
          exact
          path="/signin"
          component={(props) => <Signin {...props} />}
        />

        <ProtectedRoute
          exact
          path="/home"
          component={(props) => <Home {...props} />}
        />
      </Switch>
    </Fragment>
  );
};

export default Routes;
