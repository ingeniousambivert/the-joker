import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import { StoreProvider } from "./store";
import AppRoutes from "./routes";

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Switch>
          <Route component={AppRoutes} />
        </Switch>
      </Router>
    </StoreProvider>
  );
};

export default App;
