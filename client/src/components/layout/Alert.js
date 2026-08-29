import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { clearAlerts } from '../../actions/alertActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Alert = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alert);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  useEffect(() => {
    if (alerts.length > 0) {
      setAlert(alerts[0]);
      setOpen(true);
    }
  }, [alerts]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    // Remove the alert from the store after the animation completes
    setTimeout(() => {
      dispatch(clearAlerts());
    }, 500);
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return classes.success;
      case 'error':
        return classes.error;
      case 'warning':
        return classes.warning;
      case 'info':
      default:
        return classes.info;
    }
  };

  if (!alert) return null;

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <SnackbarContent
          className={getAlertClass(alert.alertType)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              {alert.msg}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
};

export default Alert;
