import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Backup as BackupIcon,
  Api as ApiIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    site_name: 'SchoolPilot',
    site_url: 'https://schoolpilot.example.com',
    support_email: 'support@schoolpilot.com',
    support_phone: '+1-234-567-8900',
    maintenance_mode: false,
    debug_mode: false,
    default_timezone: 'UTC',
    default_language: 'en',
    date_format: 'YYYY-MM-DD',
    time_format: '24h',
    session_timeout: 30, // minutes
    max_login_attempts: 5,
    password_expiry_days: 90,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enable_2fa: true,
    require_strong_passwords: true,
    password_min_length: 8,
    password_require_numbers: true,
    password_require_symbols: true,
    enable_ip_whitelist: false,
    enable_login_notifications: true,
    enable_audit_logs: true,
    auto_logout_inactive_users: true,
    session_timeout: 30,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    enable_email_notifications: true,
    enable_sms_notifications: false,
    enable_push_notifications: true,
    email_sender_name: 'SchoolPilot',
    email_sender_email: 'noreply@schoolpilot.com',
    sms_provider: 'twilio',
    sms_sender_id: 'SCHOOLPILOT',
    notification_sound: true,
    desktop_notifications: true,
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    enable_api: true,
    api_rate_limit: 100,
    api_key_expiry_days: 365,
    enable_webhooks: false,
    webhook_url: '',
    webhook_secret: '',
    enable_cors: true,
    allowed_origins: ['https://schoolpilot.example.com'],
  });

  useEffect(() => {
    fetchSystemInfo();
    fetchUsers();
  }, []);

  const fetchSystemInfo = async () => {
    setLoading(true);
    try {
      // Mock system info - in real app, this would come from API
      const mockSystemInfo = {
        version: '2.0.1',
        last_update: '2024-01-15',
        uptime: '15 days, 6 hours',
        total_users: 1254,
        total_schools: 42,
        active_sessions: 156,
        database_size: '2.4 GB',
        server_os: 'Ubuntu 20.04',
        php_version: '8.1',
        node_version: '18.0.0',
        memory_usage: '65%',
        cpu_usage: '42%',
      };
      setSystemInfo(mockSystemInfo);
    } catch (error) {
      toast.error('Failed to fetch system information');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await accountsAPI.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSystemSettingChange = (field, value) => {
    setSystemSettings({
      ...systemSettings,
      [field]: value,
    });
  };

  const handleSecuritySettingChange = (field, value) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value,
    });
  };

  const handleNotificationSettingChange = (field, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    });
  };

  const handleApiSettingChange = (field, value) => {
    setApiSettings({
      ...apiSettings,
      [field]: value,
    });
  };

  const handleSaveSettings = async (settingsType) => {
    setSaving(true);
    try {
      // In a real app, you would make API calls here
      switch (settingsType) {
        case 'system':
          console.log('Saving system settings:', systemSettings);
          break;
        case 'security':
          console.log('Saving security settings:', securitySettings);
          break;
        case 'notifications':
          console.log('Saving notification settings:', notificationSettings);
          break;
        case 'api':
          console.log('Saving API settings:', apiSettings);
          break;
      }
      toast.success(`${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: 'Clearing cache...',
        success: 'Cache cleared successfully!',
        error: 'Failed to clear cache',
      }
    );
  };

  const handleBackupDatabase = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        loading: 'Creating database backup...',
        success: 'Backup created successfully!',
        error: 'Failed to create backup',
      }
    );
  };

  const handleResetSystem = () => {
    if (window.confirm('Are you sure you want to reset the system? This action cannot be undone.')) {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 3000);
        }),
        {
          loading: 'Resetting system...',
          success: 'System reset completed!',
          error: 'Failed to reset system',
        }
      );
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // In real app, call API to delete user
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      // In real app, call API to update user
      toast.success('User updated successfully');
      setOpenUserDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const tabs = [
    { label: 'System', icon: <SettingsIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'API', icon: <ApiIcon /> },
    { label: 'Users', icon: <VerifiedUserIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={systemSettings.site_name}
                    onChange={(e) => handleSystemSettingChange('site_name', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Site URL"
                    value={systemSettings.site_url}
                    onChange={(e) => handleSystemSettingChange('site_url', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Support Email"
                    type="email"
                    value={systemSettings.support_email}
                    onChange={(e) => handleSystemSettingChange('support_email', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Support Phone"
                    value={systemSettings.support_phone}
                    onChange={(e) => handleSystemSettingChange('support_phone', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Default Timezone"
                    value={systemSettings.default_timezone}
                    onChange={(e) => handleSystemSettingChange('default_timezone', e.target.value)}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="America/New_York">EST</MenuItem>
                    <MenuItem value="America/Chicago">CST</MenuItem>
                    <MenuItem value="America/Denver">MST</MenuItem>
                    <MenuItem value="America/Los_Angeles">PST</MenuItem>
                    <MenuItem value="Europe/London">GMT</MenuItem>
                    <MenuItem value="Asia/Kolkata">IST</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Default Language"
                    value={systemSettings.default_language}
                    onChange={(e) => handleSystemSettingChange('default_language', e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="ar">Arabic</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Date Format"
                    value={systemSettings.date_format}
                    onChange={(e) => handleSystemSettingChange('date_format', e.target.value)}
                  >
                    <MenuItem value="YYYY-MM-DD">2024-01-15</MenuItem>
                    <MenuItem value="MM/DD/YYYY">01/15/2024</MenuItem>
                    <MenuItem value="DD/MM/YYYY">15/01/2024</MenuItem>
                    <MenuItem value="MMMM D, YYYY">January 15, 2024</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Time Format"
                    value={systemSettings.time_format}
                    onChange={(e) => handleSystemSettingChange('time_format', e.target.value)}
                  >
                    <MenuItem value="24h">24 Hour (14:30)</MenuItem>
                    <MenuItem value="12h">12 Hour (2:30 PM)</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.maintenance_mode}
                        onChange={(e) => handleSystemSettingChange('maintenance_mode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode"
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    When enabled, only super admins can access the system
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.debug_mode}
                        onChange={(e) => handleSystemSettingChange('debug_mode', e.target.checked)}
                      />
                    }
                    label="Debug Mode"
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Enable detailed error logging (not recommended for production)
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('system')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save System Settings'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchSystemInfo}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Information
                </Typography>
                
                {loading ? (
                  <LinearProgress />
                ) : systemInfo ? (
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Version" secondary={systemInfo.version} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Last Update" secondary={systemInfo.last_update} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Uptime" secondary={systemInfo.uptime} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Total Users" secondary={systemInfo.total_users} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Total Schools" secondary={systemInfo.total_schools} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Active Sessions" secondary={systemInfo.active_sessions} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Database Size" secondary={systemInfo.database_size} />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText primary="Memory Usage" secondary={systemInfo.memory_usage} />
                    </ListItem>
                  </List>
                ) : (
                  <Typography color="textSecondary">No system information available</Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Button
                  fullWidth
                  startIcon={<BackupIcon />}
                  onClick={handleBackupDatabase}
                >
                  Backup Database
                </Button>
              </CardActions>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<StorageIcon />}
                    onClick={handleClearCache}
                  >
                    Clear Cache
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => window.location.reload()}
                  >
                    Restart Application
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<DeleteIcon />}
                    onClick={handleResetSystem}
                  >
                    Reset System
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.enable_2fa}
                        onChange={(e) => handleSecuritySettingChange('enable_2fa', e.target.checked)}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Require users to enable 2FA for enhanced security
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.require_strong_passwords}
                        onChange={(e) => handleSecuritySettingChange('require_strong_passwords', e.target.checked)}
                      />
                    }
                    label="Require Strong Passwords"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Password Minimum Length"
                    value={securitySettings.password_min_length}
                    onChange={(e) => handleSecuritySettingChange('password_min_length', e.target.value)}
                    InputProps={{ inputProps: { min: 6, max: 32 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Password Expiry (Days)"
                    value={securitySettings.password_expiry_days}
                    onChange={(e) => handleSecuritySettingChange('password_expiry_days', e.target.value)}
                    InputProps={{ inputProps: { min: 30, max: 365 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.password_require_numbers}
                        onChange={(e) => handleSecuritySettingChange('password_require_numbers', e.target.checked)}
                      />
                    }
                    label="Require Numbers in Password"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.password_require_symbols}
                        onChange={(e) => handleSecuritySettingChange('password_require_symbols', e.target.checked)}
                      />
                    }
                    label="Require Symbols in Password"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.enable_ip_whitelist}
                        onChange={(e) => handleSecuritySettingChange('enable_ip_whitelist', e.target.checked)}
                      />
                    }
                    label="Enable IP Whitelist"
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Restrict access to specific IP addresses
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.enable_login_notifications}
                        onChange={(e) => handleSecuritySettingChange('enable_login_notifications', e.target.checked)}
                      />
                    }
                    label="Enable Login Notifications"
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Notify users of new login attempts
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.enable_audit_logs}
                        onChange={(e) => handleSecuritySettingChange('enable_audit_logs', e.target.checked)}
                      />
                    }
                    label="Enable Audit Logs"
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Log all system activities for security monitoring
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.auto_logout_inactive_users}
                        onChange={(e) => handleSecuritySettingChange('auto_logout_inactive_users', e.target.checked)}
                      />
                    }
                    label="Auto Logout Inactive Users"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Session Timeout (Minutes)"
                    value={securitySettings.session_timeout}
                    onChange={(e) => handleSecuritySettingChange('session_timeout', e.target.value)}
                    InputProps={{ inputProps: { min: 5, max: 240 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Login Attempts"
                    value={securitySettings.max_login_attempts}
                    onChange={(e) => handleSecuritySettingChange('max_login_attempts', e.target.value)}
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('security')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Status
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="SSL/TLS Encryption" 
                      secondary={
                        <Chip label="Active" color="success" size="small" />
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Firewall Protection" 
                      secondary={
                        <Chip label="Enabled" color="success" size="small" />
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="SQL Injection Protection" 
                      secondary={
                        <Chip label="Active" color="success" size="small" />
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="XSS Protection" 
                      secondary={
                        <Chip label="Active" color="success" size="small" />
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Last Security Scan" 
                      secondary="Today, 02:30 AM"
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Vulnerabilities Found" 
                      secondary="0"
                    />
                  </ListItem>
                </List>
              </CardContent>
              
              <CardActions>
                <Button fullWidth>
                  Run Security Scan
                </Button>
              </CardActions>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Security Events
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Failed Login Attempt" 
                      secondary="IP: 192.168.1.100 | 2 hours ago"
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="New Admin Login" 
                      secondary="Location: New York, US | 4 hours ago"
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Password Changed" 
                      secondary="User: admin@schoolpilot.com | 1 day ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <EmailIcon />
                    <Typography>Email Settings</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.enable_email_notifications}
                            onChange={(e) => handleNotificationSettingChange('enable_email_notifications', e.target.checked)}
                          />
                        }
                        label="Enable Email Notifications"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sender Name"
                        value={notificationSettings.email_sender_name}
                        onChange={(e) => handleNotificationSettingChange('email_sender_name', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sender Email"
                        type="email"
                        value={notificationSettings.email_sender_email}
                        onChange={(e) => handleNotificationSettingChange('email_sender_email', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <SmsIcon />
                    <Typography>SMS Settings</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.enable_sms_notifications}
                            onChange={(e) => handleNotificationSettingChange('enable_sms_notifications', e.target.checked)}
                          />
                        }
                        label="Enable SMS Notifications"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="SMS Provider"
                        value={notificationSettings.sms_provider}
                        onChange={(e) => handleNotificationSettingChange('sms_provider', e.target.value)}
                      >
                        <MenuItem value="twilio">Twilio</MenuItem>
                        <MenuItem value="nexmo">Vonage (Nexmo)</MenuItem>
                        <MenuItem value="aws">AWS SNS</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sender ID"
                        value={notificationSettings.sms_sender_id}
                        onChange={(e) => handleNotificationSettingChange('sms_sender_id', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <NotificationsIcon />
                    <Typography>In-App Notifications</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.enable_push_notifications}
                            onChange={(e) => handleNotificationSettingChange('enable_push_notifications', e.target.checked)}
                          />
                        }
                        label="Enable Push Notifications"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.notification_sound}
                            onChange={(e) => handleNotificationSettingChange('notification_sound', e.target.checked)}
                          />
                        }
                        label="Enable Notification Sound"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.desktop_notifications}
                            onChange={(e) => handleNotificationSettingChange('desktop_notifications', e.target.checked)}
                          />
                        }
                        label="Enable Desktop Notifications"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('notifications')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Notifications
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="outlined">
                    Send Test Email
                  </Button>
                  
                  <Button variant="outlined">
                    Send Test SMS
                  </Button>
                  
                  <Button variant="outlined">
                    Test In-App Notification
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Statistics
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText primary="Emails Sent Today" secondary="1,245" />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText primary="SMS Sent Today" secondary="324" />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText primary="Delivery Rate" secondary="98.7%" />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText primary="Failed Deliveries" secondary="16" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                API Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={apiSettings.enable_api}
                        onChange={(e) => handleApiSettingChange('enable_api', e.target.checked)}
                      />
                    }
                    label="Enable API Access"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="API Rate Limit (per minute)"
                    value={apiSettings.api_rate_limit}
                    onChange={(e) => handleApiSettingChange('api_rate_limit', e.target.value)}
                    InputProps={{ inputProps: { min: 10, max: 1000 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="API Key Expiry (Days)"
                    value={apiSettings.api_key_expiry_days}
                    onChange={(e) => handleApiSettingChange('api_key_expiry_days', e.target.value)}
                    InputProps={{ inputProps: { min: 7, max: 365 } }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={apiSettings.enable_webhooks}
                        onChange={(e) => handleApiSettingChange('enable_webhooks', e.target.checked)}
                      />
                    }
                    label="Enable Webhooks"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Webhook URL"
                    value={apiSettings.webhook_url}
                    onChange={(e) => handleApiSettingChange('webhook_url', e.target.value)}
                    placeholder="https://example.com/webhook"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Webhook Secret"
                    type="password"
                    value={apiSettings.webhook_secret}
                    onChange={(e) => handleApiSettingChange('webhook_secret', e.target.value)}
                    placeholder="Enter webhook secret key"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={apiSettings.enable_cors}
                        onChange={(e) => handleApiSettingChange('enable_cors', e.target.checked)}
                      />
                    }
                    label="Enable CORS"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Allowed Origins"
                    value={apiSettings.allowed_origins.join(', ')}
                    onChange={(e) => handleApiSettingChange('allowed_origins', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="https://example.com, https://app.example.com"
                    multiline
                    rows={2}
                  />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Separate multiple origins with commas
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveSettings('api')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save API Settings'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  API Keys
                </Typography>
                
                <List dense>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary="Production API Key" 
                      secondary="Expires: 2024-12-31"
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary="Development API Key" 
                      secondary="Expires: 2024-06-30"
                    />
                  </ListItem>
                </List>
              </CardContent>
              
              <CardActions>
                <Button fullWidth startIcon={<AddIcon />}>
                  Generate New API Key
                </Button>
              </CardActions>
            </Card>
            
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  API Usage Statistics
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText primary="Total API Requests Today" secondary="12,456" />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText primary="Successful Requests" secondary="12,300 (98.7%)" />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText primary="Failed Requests" secondary="156 (1.3%)" />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText primary="Average Response Time" secondary="248ms" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              User Management
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedUser({
                  email: '',
                  role: 'super_admin',
                  is_active: true,
                });
                setOpenUserDialog(true);
              }}
            >
              Add User
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>School</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={
                          user.role === 'super_admin' ? 'error' :
                          user.role === 'school_admin' ? 'primary' :
                          user.role === 'teacher' ? 'secondary' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{user.school_name || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? 'Active' : 'Inactive'}
                        color={user.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.last_login ? 
                        new Date(user.last_login).toLocaleDateString() : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* User Edit Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser?.id ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  email: e.target.value,
                })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                select
                fullWidth
                label="Role"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  role: e.target.value,
                })}
                sx={{ mb: 2 }}
              >
                <MenuItem value="super_admin">Super Admin</MenuItem>
                <MenuItem value="school_admin">School Admin</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
              </TextField>
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                placeholder={selectedUser.id ? "Leave empty to keep current" : "Enter password"}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  password: e.target.value,
                })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                select
                fullWidth
                label="Status"
                value={selectedUser.is_active}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  is_active: e.target.value === 'true',
                })}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminSettings;