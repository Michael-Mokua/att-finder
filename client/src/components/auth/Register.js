import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Avatar,
  CssBaseline,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/alertActions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: theme.palette.error.main,
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  formControl: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const Register = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    school: '',
    course: '',
    companyName: '',
    industry: '',
    terms: false,
  });

  const {
    name,
    email,
    password,
    password2,
    school,
    course,
    companyName,
    industry,
    terms,
  } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    return () => {
      dispatch(clearErrors());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const onUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password2) {
      dispatch({
        type: 'SET_ALERT',
        payload: { msg: 'Passwords do not match', alertType: 'error' },
      });
      return;
    }

    if (!terms) {
      dispatch({
        type: 'SET_ALERT',
        payload: { msg: 'You must accept the terms and conditions', alertType: 'error' },
      });
      return;
    }

    setLoading(true);
    
    const userData = {
      name,
      email,
      password,
      role: userType,
    };

    if (userType === 'student') {
      userData.school = school;
      userData.course = course;
    } else {
      userData.companyName = companyName;
      userData.industry = industry;
    }

    const success = await dispatch(register(userData));
    setLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper elevation={3} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create an account
        </Typography>
        {error && (
          <Typography variant="body2" className={classes.error}>
            {error}
          </Typography>
        )}
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                value={name}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="user-type-label">I am a *</InputLabel>
                <Select
                  labelId="user-type-label"
                  id="userType"
                  value={userType}
                  onChange={onUserTypeChange}
                  label="I am a *"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
                helperText="Password must be at least 6 characters"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                value={password2}
                onChange={onChange}
              />
            </Grid>

            {userType === 'student' ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="school"
                    label="School/Institution"
                    name="school"
                    value={school}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="course"
                    label="Course/Program"
                    name="course"
                    value={course}
                    onChange={onChange}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="companyName"
                    label="Company Name"
                    name="companyName"
                    value={companyName}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="industry"
                    label="Industry"
                    name="industry"
                    value={industry}
                    onChange={onChange}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="terms"
                    color="primary"
                    checked={terms}
                    onChange={onCheckboxChange}
                    required
                  />
                }
                label={
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" variant="body2">
                      Terms and Conditions
                    </Link>
                  </span>
                }
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
