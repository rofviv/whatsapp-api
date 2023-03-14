import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../Navbar";
import { Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
  },
  main: {
    padding: theme.spacing(3),
  },
}));

type MainLayoutProps = {
  children: any;  //ReactNode
};

const MainLayout = (props: MainLayoutProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Navbar />
      <Container className={classes.main}>{props.children}</Container>
    </div>
  );
};

export default MainLayout;
