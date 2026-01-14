import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
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
    registration_number: '',
    motto: '',
    logo: null, // FILE
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= Handle Change ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  /* ================= Validation ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'School name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.registration_number.trim())
      newErrors.registration_number = 'Registration number is required';
    if (!formData.motto.trim()) newErrors.motto = 'School motto is required';
    if (!formData.logo) newErrors.logo = 'School logo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('address', formData.address);
      payload.append('phone', formData.phone);
      payload.append('registration_number', formData.registration_number);
      payload.append('motto', formData.motto);
      payload.append('logo', formData.logo); // FILE

      await schoolsAPI.create(payload);

      toast.success('School created successfully');

      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        registration_number: '',
        motto: '',
        logo: null,
      });
    } catch (error) {
      console.error(
        'CREATE SCHOOL ERROR:',
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to create school'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create New School
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Only super admins can create schools.
      </Alert>

      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
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
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload School Logo *
              <input
                type="file"
                hidden
                accept="image/*"
                name="logo"
                onChange={handleChange}
              />
            </Button>
            {errors.logo && (
              <Typography color="error" variant="caption">
                {errors.logo}
              </Typography>
            )}
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
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration Number *"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              error={!!errors.registration_number}
              helperText={errors.registration_number}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="School Motto *"
              name="motto"
              value={formData.motto}
              onChange={handleChange}
              error={!!errors.motto}
              helperText={errors.motto}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create School'}
          </Button>
          <Button variant="outlined" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateSchool;
