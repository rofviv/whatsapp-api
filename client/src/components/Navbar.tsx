import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { AuthService } from "../services/AuthService";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { PAGE_ROUTE } from "../constants/page_route";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const clearSession = async () => {
    try {
      await AuthService.clearSession();
      history.replace(PAGE_ROUTE.AUTH);
      window.location.reload();
      enqueueSnackbar("Se limpio exitosamente", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Ups ocurrio un error", { variant: "error" });
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          WTS
        </Typography>
        {/* <Button color="inherit" onClick={clearSession}>
          Limpiar Sesion
        </Button> */}
        <Chip label="v2" />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
