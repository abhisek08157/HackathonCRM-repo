import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  ExitToApp
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/dashboard/customers' },
  { text: 'AI Calling', icon: <PhoneIcon />, path: '/dashboard/ai-calling' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/dashboard/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
];

function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseMenu();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🤖 AI-Enabled CRM System
          </Typography>
          
          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, {user?.name}!
            </Typography>
            <IconButton
              size="large"
              onClick={handleProfileMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#f50057' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleCloseMenu}>
                <AccountCircle sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Side Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5'
          },
        }}
      >
        <Toolbar />
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 1,
                backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
                '&:hover': { backgroundColor: '#e3f2fd' }
              }}
            >
              <ListItemIcon sx={{ color: '#1976d2' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
