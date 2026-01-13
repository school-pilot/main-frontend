import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LoginForm from '../pages/auth/Login';
import RegisterForm from '../pages/auth/Register';

const Landing = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
              <SchoolIcon sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                SchoolPilot
              </Typography>
              <Typography variant="h5" gutterBottom>
                Complete School Management System
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                Streamline your school operations with our comprehensive management platform.
                Manage students, teachers, classes, attendance, results, and more - all in one place.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <CardContent>
                      <Typography variant="h6" color="white" gutterBottom>
                        For School Administrators
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)">
                        Register your school and get started with our comprehensive management tools.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => setShowLogin(false)}
                        fullWidth
                      >
                        Register School
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <CardContent>
                      <Typography variant="h6" color="white" gutterBottom>
                        Existing Users
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.8)">
                        Login to access your dashboard and manage your school operations.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        variant="contained" 
                        onClick={() => setShowLogin(true)}
                        fullWidth
                      >
                        Login
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={10} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                bgcolor: 'background.paper'
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Button
                  variant={showLogin ? "contained" : "outlined"}
                  onClick={() => setShowLogin(true)}
                  sx={{ mr: 2 }}
                >
                  Login
                </Button>
                <Button
                  variant={!showLogin ? "contained" : "outlined"}
                  onClick={() => setShowLogin(false)}
                >
                  Register School
                </Button>
              </Box>
              
              {showLogin ? <LoginForm /> : <RegisterForm />}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                Note: Registration is only for school administrators. 
                Teachers, students, and parents will be created by school administrators.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 8, color: 'white', textAlign: 'center' }}>
          <Typography variant="body2">
            © 2024 SchoolPilot. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;