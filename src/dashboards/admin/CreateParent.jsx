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
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateParent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    occupation: '',
    student_email: '',
    relationship: 'parent',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.student_email) newErrors.student_email = 'Student email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (user && !user.is_active) {
      toast.error('Your account is inactive. Cannot create parent.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create parent with parent role automatically
      const parentData = {
        ...formData,
        role: 'parent', // Auto-assign parent role
        school_id: user?.school_id,
      };
      
      await authAPI.register(parentData);
      toast.success('Parent created successfully!');
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        occupation: '',
        student_email: '',
        relationship: 'parent',
      });
    } catch (error) {
      toast.error('Failed to create parent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create New Parent
      </Typography>
      
      {user && !user.is_active && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your account is inactive. You cannot create parents until activated by super admin.
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, width: '100%' }}>
            Parent Information
          </Typography>
          
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
              disabled={user && !user.is_active}
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
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name *"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              required
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name *"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              required
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              disabled={user && !user.is_active}
            >
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="guardian">Guardian</MenuItem>
              <MenuItem value="sibling">Sibling</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1, width: '100%' }}>
            Student Information
          </Typography>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Email *"
              name="student_email"
              type="email"
              value={formData.student_email}
              onChange={handleChange}
              error={!!errors.student_email}
              helperText={errors.student_email}
              required
              disabled={user && !user.is_active}
              placeholder="Enter the email of the student to link"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (user && !user.is_active)}
          >
            {loading ? 'Creating...' : 'Create Parent'}
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

export default CreateParent;