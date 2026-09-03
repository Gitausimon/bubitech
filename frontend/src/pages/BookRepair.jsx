import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Container } from '@mui/material';

function BookRepair() {
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    deviceModel: '',
    issueDescription: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/repairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => res.json()).then(data => {
      alert(`Repair Booked! Your tracking number is: ${data.data._id}`);
      setFormData({ customerName: '', contact: '', deviceModel: '', issueDescription: '' });
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="sm">
        <Typography variant="h3" fontWeight="bold" gutterBottom align="center">
          Book a Repair
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Tell us about your device issue and we'll get it fixed.
        </Typography>

        <Card sx={{ p: 2 }}>
          <CardContent component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <TextField 
              label="Full Name" 
              variant="outlined" 
              required
              fullWidth
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
            />

            <TextField 
              label="Contact Info (Phone/Email)" 
              variant="outlined" 
              required
              fullWidth
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
            />

            <TextField 
              label="Device Model" 
              variant="outlined" 
              placeholder="e.g. iPhone 13 Pro"
              required
              fullWidth
              value={formData.deviceModel}
              onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
            />

            <TextField 
              label="Describe the Issue" 
              variant="outlined" 
              required
              fullWidth
              multiline
              rows={4}
              value={formData.issueDescription}
              onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
            />

            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
            >
              Submit Repair Ticket
            </Button>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default BookRepair;
