import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import {
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  icon: {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  const renderStudentDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <WorkIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Find Opportunities
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Browse and apply for attachment and internship opportunities from top companies.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/opportunities"
              color="primary"
              fullWidth
              variant="contained"
            >
              Browse Opportunities
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <PersonIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              My Profile
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Complete your profile to increase your chances of getting selected.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/profile"
              color="primary"
              fullWidth
            >
              Edit Profile
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <SchoolIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              My Applications
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Track the status of your applications and see updates from companies.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/my-applications"
              color="primary"
              fullWidth
            >
              View Applications
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCompanyDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <WorkIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Post New Opportunity
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Create a new attachment or internship opportunity to attract talented students.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/create-opportunity"
              color="primary"
              fullWidth
              variant="contained"
            >
              Post Opportunity
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <BusinessIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              My Opportunities
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              Manage your posted opportunities and view applications from students.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/company/opportunities"
              color="primary"
              fullWidth
            >
              Manage Opportunities
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <PersonIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Manage Users
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              View and manage all users on the platform.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/admin/users"
              color="primary"
              fullWidth
            >
              User Management
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <BusinessIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Manage Companies
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              View and manage all registered companies.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/admin/companies"
              color="primary"
              fullWidth
            >
              Company Management
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <SchoolIcon className={classes.icon} />
            <Typography gutterBottom variant="h5" component="h2" align="center">
              Manage Students
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">
              View and manage all registered students.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/admin/students"
              color="primary"
              fullWidth
            >
              Student Management
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name?.split(' ')[0]}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Here's what's happening with your account today.
        </Typography>
      </Box>

      <Divider style={{ marginBottom: '2rem' }} />

      {user?.role === 'student' && renderStudentDashboard()}
      {user?.role === 'company' && renderCompanyDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </Container>
  );
};

export default Dashboard;
