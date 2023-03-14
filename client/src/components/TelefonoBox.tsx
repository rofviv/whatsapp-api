import React from "react";
import { Chip, makeStyles, Typography } from "@material-ui/core";
import { Envio } from '../interfaces/envio';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

type TelefonoBoxProps = {
  value: Envio;
};

const TelefonoBox = ({ value }: TelefonoBoxProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography>{value.telefono}</Typography>
      <Chip label={value.estatus}/>
    </div>
  );
};

export default TelefonoBox;
