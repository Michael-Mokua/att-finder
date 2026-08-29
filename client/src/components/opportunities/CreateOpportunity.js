import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Box,
  Chip,
  CircularProgress,
} from '@material-ui/core';
import { createOpportunity } from '../../actions/opportunityActions';
import { setAlert } from '../../actions/alertActions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const CreateOpportunity = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.opportunities);

  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    description: '',
    requirements: '',
    skills: [],
    location: '',
    duration: '',
    startDate: '',
    endDate: '',
    deadline: '',
    salary: '',
    positions: 1,
  });

  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.role !== 'company') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.deadline) newErrors.deadline = 'Application deadline is required';
    
    // Date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(formData.startDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : null;
    const deadline = new Date(formData.deadline);
    
    if (startDate && startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    
    if (endDate && startDate && endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (deadline && startDate && deadline >= startDate) {
      newErrors.deadline = 'Deadline must be before the start date';
    }
    
    if (deadline && deadline < today) {
      newErrors.deadline = 'Deadline cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Format dates for backend
    const opportunityData = {
      ...formData,
      company: user._id,
      positions: parseInt(formData.positions, 10),
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
    };
    
    dispatch(createOpportunity(opportunityData, navigate));
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <Typography component="h1" variant="h4" gutterBottom>
          Post a New Opportunity
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Fill in the details below to create a new attachment or internship opportunity.
        </Typography>
        
        <form onSubmit={handleSubmit} className={classes.form}>
          {/* Basic Information */}
          <div className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider style={{ marginBottom: 24 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="Opportunity Title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.type}
                >
                  <InputLabel id="type-label">Opportunity Type *</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Opportunity Type *"
                  >
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="attachment">Attachment</MenuItem>
                  </Select>
                  {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description || 'Provide a detailed description of the opportunity'}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="requirements"
                  name="requirements"
                  label="Requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  error={!!errors.requirements}
                  helperText={errors.requirements || 'List the requirements for this opportunity'}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="newSkill"
                  label="Required Skills"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  error={!!errors.skills}
                  helperText={errors.skills || 'Add skills required for this opportunity'}
                  variant="outlined"
                  margin="normal"
                />
                <div className={classes.chips}>
                  {formData.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>
          
          {/* Location & Duration */}
          <div className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Location & Duration
            </Typography>
            <Divider style={{ marginBottom: 24 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="location"
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location || 'e.g., Nairobi, Remote'}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="duration"
                  name="duration"
                  label="Duration"
                  value={formData.duration}
                  onChange={handleChange}
                  error={!!errors.duration}
                  helperText={errors.duration || 'e.g., 3 months, 6 months'}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="startDate"
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="endDate"
                  name="endDate"
                  label="End Date (Optional)"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </div>
          
          {/* Additional Information */}
          <div className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Divider style={{ marginBottom: 24 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="deadline"
                  name="deadline"
                  label="Application Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  error={!!errors.deadline}
                  helperText={errors.deadline || 'Last date to apply'}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="salary"
                  name="salary"
                  label="Salary/Stipend (Optional)"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: 'KSh ',
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="positions"
                  name="positions"
                  label="Number of Positions"
                  type="number"
                  value={formData.positions}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  inputProps={{
                    min: 1,
                  }}
                />
              </Grid>
            </Grid>
          </div>
          
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Post Opportunity'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateOpportunity;
