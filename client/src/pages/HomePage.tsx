import {
  Grid,
  TextField,
  makeStyles,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { read, utils, writeFile } from "xlsx";
import ProgressDialog from "../components/ProgressDialog";
import TelefonoBox from "../components/TelefonoBox";
import { NO_IMAGE } from "../constants/constants";
import { delay } from "../utils/delay";
import { Envio, ESTATUS_ENVIO } from "../interfaces/envio";
import { EnvioService } from "../services/EnvioService";
import { MessageException } from "../constants/messageException";
import { fileName } from "../utils/file";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendValidationSchema } from "../config/sendValidationSchema";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
  },
  container: {
    padding: theme.spacing(2),
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
  inputFile: {
    display: "none",
  },
  image: {
    marginTop: theme.spacing(2),
    height: 200,
  },
  telefonoList: {
    marginTop: theme.spacing(2),
    maxHeight: "65vh",
    overflowY: "auto",
  },
  mt2: {
    marginTop: theme.spacing(2),
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [telefonos, setTelefonos] = useState<Envio[]>([]);
  const [imagen, setImagen] = useState<File>();
  const [excelFile, setExcelFile] = useState<File>();
  const [cantidadEnviado, setCantidadEnviado] = useState(0);
  const isCancel = useRef(false);
  const [isOpenProgress, setIsOpenProgress] = useState(false);
  const form = useForm({
    resolver: yupResolver(sendValidationSchema),
    defaultValues: {
      //countryCode: 591,
      delay: 4,
    } as any,
  });

  useEffect(() => {
    if (cantidadEnviado !== 0 && cantidadEnviado === telefonos.length)
      envioTerminado();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantidadEnviado, telefonos.length]);

  const readExcelFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    setExcelFile(file!);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file!);
    fileReader.onload = (e) => {
      const bufferArray = e.target!.result;
      const wb = read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json(ws);
      console.log("data", data);
      if (data.length > 0 && !(data[0] as any).telefono) {
        enqueueSnackbar('Excel no valido, debe agregar el titulo "telefono"');
        return;
      }
      const telefonos = data.map((item: any) => ({
        telefono: item?.telefono,
        estatus: "En Espera",
      }));
      setTelefonos(telefonos);
    };
  };

  const isInvalid = () => {
    if (telefonos.length === 0) {
      enqueueSnackbar("Debe importar los Telefonos");
      return true;
    }
    return false;
  };

  const handleSubmit = async (data: any) => {
    if (isInvalid()) return;
    setIsCancel(false);
    setIsOpenProgress(true);
    try {
      for (let index = 0; index < telefonos.length; index++) {
        const telefono = telefonos[index];
        let result;
        let phoneNumber = data.countryCode? `${data.countryCode}${telefono.telefono}`: telefono.telefono;
        if (isCancel.current) break;
        await delay(data.delay * 1000);
        if (isNaN(Number(phoneNumber))) {
          result = { status: "NOT_NUMBER" };
        } else {
          result = await EnvioService.sendMessageGeneral(
            Number(phoneNumber),
            data.message,
            imagen
          );
        }
        console.log("isCancel", isCancel.current, index);
        telefono.estatus =
          (ESTATUS_ENVIO as any)[result.status] ?? ESTATUS_ENVIO.ERROR;
        setCantidadEnviado((cantidadEnviado) => cantidadEnviado + 1);
      }
    } catch (error) {
      enqueueSnackbar(MessageException.general, { variant: "error" });
    }
  };

  const selectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    setImagen(file!);
  };

  const setIsCancel = (value: boolean) => {
    isCancel.current = value;
  };

  const handleCloseProgressDialog = (reason: any) => {
    setIsOpenProgress(false);
  };

  const envioTerminado = () => {
    enqueueSnackbar("Operación realizada", { variant: "success" });
    setCantidadEnviado(0);
    handleCloseProgressDialog("cancel");
  };

  const cancelarEnvio = () => {
    setIsCancel(true);
    setCantidadEnviado(0);
    handleCloseProgressDialog("cancel");
  };

  const createResumeExcel = () => {
    const workBook = utils.book_new();
    const worksheet = utils.json_to_sheet(telefonos);
    utils.book_append_sheet(workBook, worksheet, "Envio Whatsapp");
    writeFile(workBook, `resumen-${fileName(excelFile!)}_${Date.now()}.xlsx`);
  };

  const hasError = (name: string) => {
    return form.formState.errors[name]?.message;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} className={classes.mb2}>
        <input
          id="excel-file"
          className={classes.inputFile}
          type="file"
          onChange={readExcelFile}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <Box display="flex" alignItems="center">
          <label htmlFor="excel-file">
            <Button variant="contained" color="secondary" component="span">
              Importar Telefonos
            </Button>
          </label>
          <div className={classes.ml2} style={{ overflow: "hidden" }}>
            <Typography color="textSecondary">
              {telefonos.length} Contactos
            </Typography>
            <Typography
              style={{
                fontSize: "0.8rem",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {excelFile?.name}
            </Typography>
          </div>
        </Box>
        {telefonos.length > 0 ? (
          <>
            <div className={classes.telefonoList}>
              {telefonos.map((telefono, i) => (
                <TelefonoBox key={i} value={telefono} />
              ))}
            </div>
            <Button
              className={classes.mt2}
              variant="contained"
              color="secondary"
              onClick={createResumeExcel}
            >
              Descargar Resumen
            </Button>
          </>
        ) : (
          <Typography className={classes.mt2} variant="h6">
            No hay Datos
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography className={classes.mb2} variant="h6">Mensaje</Typography>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <Controller
                    name="countryCode"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        label="Códigos País *"
                        fullWidth
                        error={Boolean(hasError("countryCode"))}
                        helperText={hasError("countryCode")}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <Controller
                    name="delay"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        label="Demora (seg) *"
                        fullWidth
                        error={Boolean(hasError("delay"))}
                        helperText={hasError("delay")}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        label="Mensage *"
                        multiline
                        minRows={5}
                        fullWidth
                        error={Boolean(hasError("message"))}
                        helperText={hasError("message")}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Box display="flex" alignItems="center" flexWrap="wrap" mb={3}>
                <Box mr={2}>
                  {imagen ? (
                    <img
                      className={classes.image}
                      src={URL.createObjectURL(imagen)}
                      alt="imagen"
                    />
                  ) : (
                    <img
                      className={classes.image}
                      src={NO_IMAGE}
                      alt="sin imagen"
                    />
                  )}
                </Box>
                <input
                  id="image-file"
                  className={classes.inputFile}
                  type="file"
                  accept="image/*"
                  onChange={selectImage}
                />
                <label htmlFor="image-file">
                  <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                  >
                    Agregar Imagen
                  </Button>
                </label>
              </Box>
              <Button variant="contained" color="primary" type="submit">
                Enviar
              </Button>
              <ProgressDialog
                open={isOpenProgress}
                onCloseDialog={handleCloseProgressDialog}
                onCancel={cancelarEnvio}
                total={telefonos.length}
                cantidadEnviado={cantidadEnviado}
              />
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomePage;
