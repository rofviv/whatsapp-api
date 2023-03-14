import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { Box, Typography } from "@material-ui/core";

type ProgressDialogProps = {
  onCancel: () => void;
  onCloseDialog: (event: any) => void;
  open: boolean;
  cantidadEnviado: number;
  total: number;
};

const ProgressDialog = (props: ProgressDialogProps) => {
  const { open, onCancel, total, cantidadEnviado } = props;

  const getProgres = () => {
    if (cantidadEnviado === 0) return 0;
    return (cantidadEnviado / total) * 100;
  };

  return (
    <Dialog
      open={open}
      // onClose={onCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">Espere por favor</DialogTitle>
      <DialogContent>
        <LinearProgressWithLabel value={getProgres()} />
        <Box mt={1}>
          <Typography>
            {cantidadEnviado}/{total} Enviados
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressDialog;
