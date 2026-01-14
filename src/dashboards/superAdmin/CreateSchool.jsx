import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { schoolsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CreateSchool = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    website: '',
    type: 'private',
    established_year: new Date().getFullYear(),
    max_students: 1000,
    subscription_plan: 'basic',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'School name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      await schoolsAPI.create(formData);
      toast.success('School created successfully!');
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        website: '',
        type: 'private',
        established_year: new Date().getFullYear(),
        max_students: 1000,
        subscription_plan: 'basic',
      });
    } catch (error) {
      console.error("CREATE SCHOOL ERROR:", error.response?.data || error.message);
  toast.error(
    error.response?.data?.message || "Failed to create school"
  ); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create New School
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This form is for creating new schools in the system. Only super admins can create schools.
      </Alert>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="School Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address *"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="School Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="international">International</MenuItem>
              <MenuItem value="boarding">Boarding</MenuItem>
              <MenuItem value="day">Day School</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Established Year"
              name="established_year"
              type="number"
              value={formData.established_year}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maximum Students"
              name="max_students"
              type="number"
              value={formData.max_students}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Subscription Plan"
              name="subscription_plan"
              value={formData.subscription_plan}
              onChange={handleChange}
            >
              <MenuItem value="basic">Basic (Free)</MenuItem>
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create School'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateSchool;
