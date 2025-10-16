import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { customerAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function AddCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead'
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await customerAPI.create(formData);
      setSuccess(true);
      
      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/customers');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'customer', label: 'Customer' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          href="/dashboard" 
          onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
        >
          Dashboard
        </Link>
        <Link 
          color="inherit" 
          href="/dashboard/customers"
          onClick={(e) => { e.preventDefault(); navigate('/dashboard/customers'); }}
        >
          Customers
        </Link>
        <Typography color="text.primary">Add Customer</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/customers')}
          sx={{ mr: 2 }}
        >
          Back to Customers
        </Button>
        <PersonIcon sx={{ mr: 1, fontSize: 30, color: '#1976d2' }} />
        <Typography variant="h4">
          Add New Customer
        </Typography>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          🎉 Customer created successfully! Redirecting to customer list...
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., John Doe"
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., john@example.com"
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., +1 (555) 123-4567"
              />
            </Grid>

            {/* Company */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., Tech Solutions Inc"
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                required
                label="Customer Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                helperText="Select the current relationship status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating Customer...' : 'Create Customer'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard/customers')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default AddCustomer;
