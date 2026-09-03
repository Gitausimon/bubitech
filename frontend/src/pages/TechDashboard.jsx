import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, MenuItem, Select, Chip, Container } from '@mui/material';

function TechDashboard() {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/repairs')
      .then(res => res.json())
      .then(data => setRepairs(data.data || []));
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/repairs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(res => res.json()).then(data => {
      setRepairs(repairs.map(r => r._id === id ? data.data : r));
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Ready for Pickup': return 'info';
      case 'Repairing': return 'warning';
      case 'Quote Sent': return 'primary';
      case 'Received':
      case 'Diagnosing':
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Technician Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your repair queue and update statuses.
        </Typography>
        
        <Grid container spacing={3} direction="column">
          {repairs.map(repair => (
            <Grid item key={repair._id}>
              <Card sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', md: 'center' },
                  p: 2
                }}>
                <Box sx={{ flex: 1, mb: { xs: 2, md: 0 } }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ID: {repair._id}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {repair.deviceModel}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 2, mb: { xs: 2, md: 0 }, pr: { md: 4 } }}>
                  <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Issue" size="small" /> {repair.issueDescription}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="500">
                    {repair.customerName} - {repair.contact}
                  </Typography>
                </Box>

                <Box sx={{ flexShrink: 0, minWidth: 200 }}>
                  <Select
                    fullWidth
                    size="small"
                    value={repair.status}
                    onChange={(e) => updateStatus(repair._id, e.target.value)}
                    sx={{
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        color: `${getStatusColor(repair.status)}.main`,
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <MenuItem value="Received">Received</MenuItem>
                    <MenuItem value="Diagnosing">Diagnosing</MenuItem>
                    <MenuItem value="Quote Sent">Quote Sent</MenuItem>
                    <MenuItem value="Repairing">Repairing</MenuItem>
                    <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default TechDashboard;
