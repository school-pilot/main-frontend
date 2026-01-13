import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { schoolsAPI, authAPI } from '../../services/api.js';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    pendingSchools: 0,
    totalUsers: 0,
  });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schoolsResponse, usersResponse] = await Promise.all([
        schoolsAPI.getAllSchools(),
        authAPI.getUsers(),
      ]);
      
      const schoolsData = schoolsResponse.data || [];
      const usersData = usersResponse.data || [];
      
      setStats({
        totalSchools: schoolsData.length,
        activeSchools: schoolsData.filter(s => s.is_active).length,
        pendingSchools: schoolsData.filter(s => !s.is_active).length,
        totalUsers: usersData.length,
      });
      
      setSchools(schoolsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSchool = async (schoolId) => {
    try {
      await schoolsAPI.updateSchool(schoolId, { is_active: true });
      toast.success('School activated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to activate school');
    }
  };

  const handleDeactivateSchool = async (schoolId) => {
    try {
      await schoolsAPI.updateSchool(schoolId, { is_active: false });
      toast.success('School deactivated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to deactivate school');
    }
  };

  const statCards = [
    {
      title: 'Total Schools',
      value: stats.totalSchools,
      icon: <SchoolIcon />,
      color: '#1976d2',
    },
    {
      title: 'Active Schools',
      value: stats.activeSchools,
      icon: <CheckCircleIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Pending Schools',
      value: stats.pendingSchools,
      icon: <HistoryIcon />,
      color: '#ed6c02',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Super Admin Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color, fontSize: 40 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Schools Management</Typography>
          <Button
            variant="contained"
            startIcon={<SchoolIcon />}
            href="/super-admin/create-school"
          >
            Create School
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>School Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell>{school.address}</TableCell>
                  <TableCell>
                    <Chip
                      label={school.is_active ? 'Active' : 'Inactive'}
                      color={school.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(school.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleActivateSchool(school.id)}
                      disabled={school.is_active}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeactivateSchool(school.id)}
                      disabled={!school.is_active}
                    >
                      <CancelIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SuperAdminDashboard;