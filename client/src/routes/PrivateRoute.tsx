import React from "react";
import { Redirect, Route } from "react-router-dom";
import { PAGE_ROUTE } from "../constants/page_route";
import { AuthService } from "../services/AuthService";

type PrivateRouteProps = {
  component: React.ComponentType<any>;
  exact?: boolean;
  path: string;
};

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        AuthService.verifyAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect to={PAGE_ROUTE.AUTH} />
        )
      }
    />
  );
};

export default PrivateRoute;
