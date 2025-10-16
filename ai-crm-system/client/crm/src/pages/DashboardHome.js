import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function DashboardHome() {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Customers', value: '0', icon: <PeopleIcon />, color: '#1976d2' },
    { title: 'AI Calls Made', value: '0', icon: <PhoneIcon />, color: '#388e3c' },
    { title: 'Conversion Rate', value: '0%', icon: <TrendingUpIcon />, color: '#f57c00' },
    { title: 'Performance Score', value: '0%', icon: <AssessmentIcon />, color: '#7b1fa2' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Here's your CRM overview for today
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: stat.color,
                      color: 'white',
                      mr: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Add your first customer<br/>
          • Set up AI calling preferences<br/>
          • Configure call scripts<br/>
          • View analytics dashboard
        </Typography>
      </Paper>

      {/* Coming Soon */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          🎯 What's Coming Next
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We're building the customer management system, AI voice features, and analytics dashboard. 
          Stay tuned for amazing features! 🎉
        </Typography>
      </Paper>
    </Box>
  );
}

export default DashboardHome;
