import {
  CircularProgress,
  makeStyles,
  Typography,
  Grid,
  Paper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import { PAGE_ROUTE } from "../constants/page_route";
import { AuthService } from "../services/AuthService";
import QrCreator from "qr-creator";
import { useSnackbar } from "notistack";
import MainLayout from "../components/layouts/main/MainLayout";
import { API_URL } from "../constants/api";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  center: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  qr: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
  },
  mt3: {
    marginTop: theme.spacing(3),
  },
  qrContent: {
    padding: theme.spacing(2),
  },
  loading: {
    height: 256,
    width: 256,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const AuthPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log("init AuthPage");
    const socket = io(API_URL);
    socket.on("connect", () => {
      console.log("connect", socket.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.on("qr", (qr) => {
      console.log("qr", qr);
      setIsLoading(false);
      const qrcodeDiv = document.getElementById("qrcode");
      qrcodeDiv!.innerHTML = "";

      QrCreator.render(
        {
          text: qr,
          radius: 0.5, // 0.0 to 0.5
          ecLevel: "H", // L, M, Q, H
          fill: "#122E31", // foreground color
          background: null, // color or null for transparent
          size: 256, // in pixels
        },
        qrcodeDiv!
      );
    });
    socket.on("authenticated", (ok) => {
      if (ok) {
        AuthService.login();
        history.push(PAGE_ROUTE.HOME);
        enqueueSnackbar("Autenticacion Exitosa", { variant: "success" });
      } else {
        enqueueSnackbar("Autenticacion Fallida", { variant: "error" });
      }
    });
    return () => {
      console.log("authpage unmount");
      socket.removeAllListeners();
    };
  }, []);

  return (
    <MainLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.title} variant="h5">
            Por favor escanee el QR, para autenticarse
          </Typography>
          <Typography>Puede tardar de 20 a 30 segundos</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.qr}>
            {isLoading && (
              <div className={classes.loading}>
                <CircularProgress />
              </div>
            )}
            <Box
              component={Paper}
              className={classes.qrContent}
              style={{ display: isLoading ? "none" : "block" }}
            >
              <div id="qrcode"></div>
            </Box>
          </div>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default AuthPage;
