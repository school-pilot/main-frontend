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
  CreditCard,
  Users,
  UserCircle,
  Bell,
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  GraduationCap,
  ClipboardCheck,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

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
      { text: 'Notifications', icon: <Bell />, path: '/notifications' },
    ];

    // Get role in lowercase for comparison
    const userRole = user.role?.toLowerCase();
    
    switch (userRole) {
      case 'super_admin':
      case 'school_admin':
      case 'admin':
        return [
          ...baseItems,
          { text: 'Students', icon: <Users />, path: '/admin/students' },
          { text: 'Teachers', icon: <UserCircle />, path: '/admin/teachers' },
          { text: 'Fees', icon: <CreditCard />, path: '/admin/fees' },
          { text: 'Timetable', icon: <Clock />, path: '/admin/timetable' },
          { text: 'Reports', icon: <BarChart3 />, path: '/admin/reports' },
          { text: 'Academics', icon: <GraduationCap />, path: '/academics/classes' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { text: 'Attendance', icon: <ClipboardCheck />, path: '/teacher/attendance' },
          { text: 'Enter Scores', icon: <BookIcon />, path: '/teacher/scores' },
          { text: 'My Classes', icon: <SchoolIcon />, path: '/teacher/classes' },
          { text: 'My Timetable', icon: <Clock />, path: '/teacher/timetable' },
        ];
      case 'student':
        return [
          ...baseItems,
          { text: 'My Results', icon: <FileText />, path: '/student/results' },
          { text: 'Timetable', icon: <Clock />, path: '/student/timetable' },
          { text: 'My Profile', icon: <AccountCircleIcon />, path: '/student/profile' },
        ];
      default:
        return baseItems;
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
    }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '100%'
        }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <SchoolIcon sx={{ color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              fontSize: '1.25rem',
              background: 'linear-gradient(90deg, #ffffff 0%, #bfdbfe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '0.5px'
            }}>
              SchoolPilot
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.75rem',
              display: 'block',
              mt: 0.5
            }}>
              Education Management
            </Typography>
          </Box>
          {!isMobile && (
            <IconButton 
              onClick={handleDrawerToggle} 
              size="small"
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ 
        flexGrow: 1,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '2px',
        },
      }}>
        <List sx={{ p: 2 }}>
          {getMenuItems().map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    backgroundColor: isActive 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'transparent',
                    borderLeft: isActive 
                      ? '4px solid #ffffff' 
                      : '4px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateX(5px)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      },
                    },
                    backdropFilter: isActive ? 'blur(10px)' : 'none',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    minWidth: 40,
                    mr: 2,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? '600' : '500',
                      color: 'white',
                      letterSpacing: '0.3px'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Info & Actions */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* User Profile */}
        <Box sx={{ 
          p: 2, 
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <AccountCircleIcon sx={{ color: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: '600',
                color: 'white',
                lineHeight: 1.2
              }}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'capitalize',
                display: 'block'
              }}>
                {user?.role?.replace('_', ' ')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <List sx={{ p: 0 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                navigate('/change-password');
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                minWidth: 40,
              }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Change Password" 
                primaryTypographyProps={{ 
                  fontSize: '0.875rem',
                  color: 'white',
                  fontWeight: '500'
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: 2,
                py: 1.5,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: '#fecaca',
                minWidth: 40,
              }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  fontSize: '0.875rem',
                  color: '#fecaca',
                  fontWeight: '600'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
    }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
            },
          },
        }}
      />
      
      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          background: 'transparent',
        }}
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
              border: 'none',
              boxShadow: isMobile 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                : '0 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content Area */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}>
        {/* Navbar */}
        <Box sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <Navbar 
            toggleSidebar={handleDrawerToggle}
            user={user}
          />
        </Box>
        
        {/* Page Content */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#f8fafc',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            opacity: 0.03,
            zIndex: 0,
          }
        }}>
          <Box sx={{ 
            position: 'relative', 
            zIndex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: '100%',
            mx: 'auto',
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 
