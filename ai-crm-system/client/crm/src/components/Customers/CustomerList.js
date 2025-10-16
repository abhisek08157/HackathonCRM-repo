import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Chip, Box, Typography
} from '@mui/material';
import { Add as AddIcon, Phone as PhoneIcon } from '@mui/icons-material';
import axios from 'axios';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'lead': return 'info';
      case 'prospect': return 'warning';
      case 'customer': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Customers</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {/* Add customer logic */}}
        >
          Add Customer
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.company || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={customer.status} 
                    color={getStatusColor(customer.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    startIcon={<PhoneIcon />}
                    onClick={() => {/* AI calling logic */}}
                  >
                    AI Call
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

