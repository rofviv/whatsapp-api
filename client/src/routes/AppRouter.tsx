import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { PAGE_ROUTE } from "../constants/page_route";
import AuthPage from "../pages/AuthPage";
// import NotFoundPage from "../pages/NotFoundPage";
import MainRouter from "./MainRouter";

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={PAGE_ROUTE.AUTH} component={AuthPage} />
        <PrivateRoute path="/" component={MainRouter} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
