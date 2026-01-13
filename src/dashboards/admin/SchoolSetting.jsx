import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { schoolsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SchoolSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [schoolData, setSchoolData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    established_year: '',
    motto: '',
    principal_name: '',
    timezone: 'UTC',
    language: 'en',
    currency: 'USD',
    enable_notifications: true,
    enable_sms_alerts: false,
    enable_email_alerts: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.school_id) {
      fetchSchoolData();
    }
  }, [user]);

  const fetchSchoolData = async () => {
    try {
      const response = await schoolsAPI.getSchool(user.school_id);
      setSchoolData(response.data);
    } catch (error) {
      toast.error('Failed to fetch school data');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchoolData({
      ...schoolData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await schoolsAPI.updateSchool(user.school_id, schoolData);
      toast.success('School settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save school settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        School Settings
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Basic Information" />
          <Tab label="Academic Settings" />
          <Tab label="Notification Settings" />
        </Tabs>
        
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School Name"
                name="name"
                value={schoolData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={schoolData.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={schoolData.phone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={schoolData.website}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Established Year"
                name="established_year"
                type="number"
                value={schoolData.established_year}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School Motto"
                name="motto"
                value={schoolData.motto}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Principal Name"
                name="principal_name"
                value={schoolData.principal_name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={schoolData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}
        
        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Timezone"
                name="timezone"
                value={schoolData.timezone}
                onChange={handleChange}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
                <MenuItem value="CST">CST</MenuItem>
                <MenuItem value="GMT">GMT</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Language"
                name="language"
                value={schoolData.language}
                onChange={handleChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Currency"
                name="currency"
                value={schoolData.currency}
                onChange={handleChange}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="INR">INR</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={schoolData.enable_notifications}
                    onChange={handleChange}
                    name="enable_notifications"
                  />
                }
                label="Enable System Notifications"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={schoolData.enable_email_alerts}
                    onChange={handleChange}
                    name="enable_email_alerts"
                  />
                }
                label="Enable Email Alerts"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={schoolData.enable_sms_alerts}
                    onChange={handleChange}
                    name="enable_sms_alerts"
                  />
                }
                label="Enable SMS Alerts"
              />
            </Grid>
          </Grid>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SchoolSettings;