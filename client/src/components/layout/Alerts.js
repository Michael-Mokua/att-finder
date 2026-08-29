import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { removeAlert } from '../../actions/alert';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiSnackbarContent-root': {
      minWidth: '250px',
      '&.error': {
        backgroundColor: theme.palette.error.main,
      },
      '&.success': {
        backgroundColor: theme.palette.success.main,
      },
      '&.info': {
        backgroundColor: theme.palette.info.main,
      },
      '&.warning': {
        backgroundColor: theme.palette.warning.main,
      },
    },
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Alerts = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alert);

  const handleClose = (id) => {
    dispatch(removeAlert(id));
  };

  const getAlertContent = (alert) => {
    return (
      <SnackbarContent
        className={alert.alertType}
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
            onClick={() => handleClose(alert.id)}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  };

  return (
    <div className={classes.root}>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <Snackbar
            key={alert.id}
            open={true}
            autoHideDuration={6000}
            onClose={() => handleClose(alert.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            {getAlertContent(alert)}
          </Snackbar>
        ))}
    </div>
  );
};

export default Alerts;
