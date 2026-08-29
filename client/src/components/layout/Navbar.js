import React, { Fragment, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { logout } from '../../actions/auth';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
    textDecoration: 'none',
    color: 'inherit',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  menuItem: {
    minWidth: 200,
  },
  menuIcon: {
    minWidth: theme.spacing(5),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const guestLinks = (
    <>
      <Button color="inherit" component={RouterLink} to="/login">
        Login
      </Button>
      <Button
        color="secondary"
        variant="contained"
        component={RouterLink}
        to="/register"
        style={{ marginLeft: '10px' }}
      >
        Sign Up
      </Button>
    </>
  );

  const authLinks = (
    <>
      <Button color="inherit" component={RouterLink} to="/opportunities">
        Opportunities
      </Button>
      {user?.role === 'company' && (
        <Button color="inherit" component={RouterLink} to="/create-opportunity">
          Post Opportunity
        </Button>
      )}
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {user?.profilePicture ? (
          <Avatar
            alt={user?.name}
            src={user?.profilePicture}
            className={classes.avatar}
          />
        ) : (
          <AccountCircle />
        )}
        {!isMobile && (
          <Typography variant="body1" style={{ marginLeft: '8px' }}>
            {user?.name?.split(' ')[0]}
          </Typography>
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          component={RouterLink}
          to="/dashboard"
          onClick={handleClose}
          className={classes.menuItem}
        >
          <ListItemIcon className={classes.menuIcon}>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </MenuItem>

        {user?.role === 'student' && (
          <MenuItem
            component={RouterLink}
            to="/my-applications"
            onClick={handleClose}
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.menuIcon}>
              <WorkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Applications" />
          </MenuItem>
        )}

        {user?.role === 'company' && (
          <MenuItem
            component={RouterLink}
            to="/company/opportunities"
            onClick={handleClose}
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.menuIcon}>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Opportunities" />
          </MenuItem>
        )}

        <Divider className={classes.divider} />

        <MenuItem
          component={RouterLink}
          to="/profile"
          onClick={handleClose}
          className={classes.menuItem}
        >
          <ListItemIcon className={classes.menuIcon}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem onClick={handleLogout} className={classes.menuItem}>
          <ListItemIcon className={classes.menuIcon}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          component={RouterLink}
          to="/"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          className={classes.title}
        >
          Att Finder
        </Typography>
        <Box display="flex" alignItems="center">
          {isAuthenticated ? authLinks : guestLinks}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
