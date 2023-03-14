import React from "react";
import { Route, Switch } from "react-router-dom";
import MainLayout from "../components/layouts/main/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { ROUTES } from "./routes";

const MainRouter = () => {
  return (
    <MainLayout>
      <Switch>
        {ROUTES.map((route) => (
          <Route
            key={route.path}
            exact
            path={route.path}
            component={route.component}
          />
        ))}
        <Route path="**">
          <NotFoundPage />
        </Route>
      </Switch>
    </MainLayout>
  );
};

export default MainRouter;
