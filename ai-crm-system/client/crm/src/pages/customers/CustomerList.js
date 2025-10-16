import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { customerAPI } from '../../services/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch customers when component loads
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Function to get all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await customerAPI.getAll(params);
      setCustomers(response.data.customers);
    } catch (err) {
      setError('Failed to load customers: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Search customers when search term changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchCustomers();
    }, 300);
    
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  // Get status color for chips
  const getStatusColor = (status) => {
    switch(status) {
      case 'lead': return 'info';
      case 'prospect': return 'warning'; 
      case 'customer': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      try {
        await customerAPI.delete(customerId);
        setCustomers(customers.filter(customer => customer._id !== customerId));
        alert('Customer deleted successfully!');
      } catch (err) {
        alert('Failed to delete customer: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Stats calculation
  const stats = {
    total: customers.length,
    leads: customers.filter(c => c.status === 'lead').length,
    prospects: customers.filter(c => c.status === 'prospect').length,
    activeCustomers: customers.filter(c => c.status === 'customer').length
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          👥 Customer Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => window.open('/dashboard/customers/add', '_self')}
          size="large"
        >
          Add New Customer
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography color="text.secondary">Total Customers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BusinessIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.leads}</Typography>
                  <Typography color="text.secondary">New Leads</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PhoneIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.prospects}</Typography>
                  <Typography color="text.secondary">Prospects</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EmailIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.activeCustomers}</Typography>
                  <Typography color="text.secondary">Active Customers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search customers by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">All Statuses</option>
              <option value="lead">Leads</option>
              <option value="prospect">Prospects</option>
              <option value="customer">Customers</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📝 No customers found
                  </Typography>
                  <Typography color="text.secondary">
                    {searchTerm || statusFilter 
                      ? 'Try adjusting your search criteria' 
                      : 'Add your first customer to get started!'
                    }
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => window.open('/dashboard/customers/add', '_self')}
                  >
                    Add Customer
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.company || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.status.toUpperCase()} 
                      color={getStatusColor(customer.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        title="AI Call Customer"
                        onClick={() => alert(`AI Calling ${customer.name} - Feature coming soon!`)}
                      >
                        <PhoneIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="info"
                        title="Edit Customer"
                        onClick={() => alert(`Edit ${customer.name} - Feature coming soon!`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        title="Delete Customer"
                        onClick={() => handleDeleteCustomer(customer._id, customer.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CustomerList;
