import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';

function POSDashboard() {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setInventory(data.data || []))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, totalAmount: total, paymentMethod: 'MPesa' })
    }).then(res => res.json()).then(data => {
        alert('Transaction Sent! ' + data.message);
        setCart([]);
    });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Left Pane: Inventory Search/Grid */}
      <Box sx={{ flex: 2, p: { xs: 2, md: 4 }, overflowY: 'auto', maxHeight: { xs: '60vh', md: '100vh' } }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Point of Sale
        </Typography>
        
        <TextField 
          fullWidth
          variant="outlined"
          placeholder="Search by IMEI, Product Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4, bgcolor: 'background.paper' }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }
          }}
        />

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50', display: { xs: 'none', sm: 'table-cell' } }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(item => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.condition}</Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{item.stock || 'N/A'}</TableCell>
                  <TableCell>
                     <Typography variant="body2">KSh {item.price.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => addToCart(item)}
                      sx={{ minWidth: { xs: '40px', sm: '80px' }, p: { xs: 1, sm: 0.5 } }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add</Box>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Right Pane: Checkout */}
      <Box sx={{ flex: 1, bgcolor: 'background.paper', borderLeft: { xs: 0, md: 1 }, borderTop: { xs: 1, md: 0 }, borderColor: 'divider', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', maxHeight: { xs: '40vh', md: '100vh' } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Current Order
        </Typography>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List disablePadding>
            {cart.map((item, idx) => (
              <React.Fragment key={item._id}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary={`${item.qty}x ${item.name}`} 
                    primaryTypographyProps={{ fontWeight: 500, variant: 'body2' }}
                  />
                  <Typography fontWeight="bold" variant="body2">
                    KSh {(item.price * item.qty).toLocaleString()}
                  </Typography>
                </ListItem>
                {idx < cart.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {cart.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center', variant: 'body2' }}>
                Cart is empty
              </Typography>
            )}
          </List>
        </Box>

        <Box sx={{ pt: 2, mt: 2, borderTop: 2, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              KSh {total.toLocaleString()}
            </Typography>
          </Box>
          <Button 
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            startIcon={<PaymentIcon />}
            sx={{ py: { xs: 1, sm: 2 }, fontWeight: 'bold' }}
          >
            Send to M-Pesa
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default POSDashboard;
