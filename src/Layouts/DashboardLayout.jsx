import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  Book as BookIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    if (!user) return [];
    
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    ];

    switch (user.role?.toLowerCase()) {
      case 'super_admin':
        return [
          ...baseItems,
          { text: 'Create School', icon: <SchoolIcon />, path: '/super-admin/create-school' },
          { text: 'Activate Accounts', icon: <AccountCircleIcon />, path: '/super-admin/activate-accounts' },
          { text: 'Audit Logs', icon: <HistoryIcon />, path: '/super-admin/audit-logs' },
          { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        ];
      case 'school_admin':
        return [
          ...baseItems,
          { text: 'Create Teacher', icon: <PeopleIcon />, path: '/school-admin/create-teacher' },
          { text: 'Create Student', icon: <PeopleIcon />, path: '/school-admin/create-student' },
          { text: 'Create Parent', icon: <PeopleIcon />, path: '/school-admin/create-parent' },
          { text: 'School Settings', icon: <SchoolIcon />, path: '/school-admin/settings' },
          { text: 'Manage Classes', icon: <SchoolIcon />, path: '/school-admin/classes' },
          { text: 'Manage Sessions', icon: <CalendarIcon />, path: '/school-admin/sessions' },
          { text: 'Reports', icon: <AssessmentIcon />, path: '/school-admin/reports' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { text: 'Mark Attendance', icon: <AccountCircleIcon />, path: '/teacher/mark-attendance' },
          { text: 'Enter Scores', icon: <BookIcon />, path: '/teacher/enter-scores' },
          { text: 'Timetable', icon: <CalendarIcon />, path: '/teacher/timetable' },
          { text: 'My Classes', icon: <SchoolIcon />, path: '/teacher/classes' },
        ];
      case 'student':
        return [
          ...baseItems,
          { text: 'View Results', icon: <AssessmentIcon />, path: '/student/results' },
          { text: 'Notifications', icon: <NotificationsIcon />, path: '/student/notifications' },
          { text: 'My Profile', icon: <AccountCircleIcon />, path: '/student/profile' },
          { text: 'Timetable', icon: <CalendarIcon />, path: '/student/timetable' },
        ];
      default:
        return baseItems;
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#374151' }}>
          SchoolPilot
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, p: 1 }}>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'white' : '#6b7280',
                minWidth: 40 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? '600' : '400',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ p: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => {
              navigate('/change-password');
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#6b7280', minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Change Password" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#fee2e2',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontSize: '0.875rem',
                color: '#ef4444',
                fontWeight: '500'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <div className="flex h-screen">
        {/* MUI Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          className="bg-white border-r border-gray-200"
        >
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid #e5e7eb',
                backgroundColor: 'white',
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Custom Navbar */}
          <Navbar 
            toggleSidebar={() => setMobileOpen(!mobileOpen)}
            title={`${user?.school_name || 'SchoolPilot'} - ${user?.role}`}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;