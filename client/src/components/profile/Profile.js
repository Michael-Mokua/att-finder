import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, TextField, Button, Box, Grid, Card, CardContent, Chip } from '@material-ui/core';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@material-ui/icons';
import { updateProfile } from '../../actions/profileActions';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing(3) },
  card: { marginBottom: theme.spacing(3), padding: theme.spacing(2) },
  chip: { margin: theme.spacing(0.5) }
}));

const Profile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', school: '', course: '', skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    if (profile) setFormData({
      name: profile.name || '', email: profile.email || '',
      phone: profile.phone || '', school: profile.school || '',
      course: profile.course || '', skills: profile.skills || []
    });
  }, [user, profile, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({...formData, skills: [...formData.skills, newSkill.trim()]});
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({...formData, skills: formData.skills.filter(s => s !== skill)});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setEditMode(false);
  };

  return (
    <Container className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4">My Profile</Typography>
        {!editMode ? (
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
            Edit
          </Button>
        ) : (
          <div>
            <Button onClick={() => setEditMode(false)} startIcon={<CancelIcon />} style={{marginRight: 8}}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<SaveIcon />}>
              Save
            </Button>
          </div>
        )}
      </Box>

      <Card className={classes.card}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School/Institution"
                name="school"
                value={formData.school}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Course/Program"
                name="course"
                value={formData.course}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                disabled={!editMode}
                margin="normal"
                helperText={editMode ? "Press Enter to add a skill" : ""}
              />
              <Box mt={2}>
                {formData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={editMode ? () => handleRemoveSkill(skill) : undefined}
                    className={classes.chip}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
