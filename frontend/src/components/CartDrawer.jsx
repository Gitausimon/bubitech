import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, List, ListItem, ListItemText, TextField, Button, Stack, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';

function CartDrawer({ cartItems, isOpen, onClose, checkOutCart, isCheckingOut }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!phoneNumber) return alert("Please enter a valid M-Pesa Number");
    if (!customerName) return alert("Please enter your name");
    if (!deliveryLocation) return alert("Please provide a delivery location");
    
    checkOutCart(phoneNumber, totalAmount, customerName, deliveryLocation);
  };

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setDeliveryLocation(`Live GPS Captured: (${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)})`);
      setGettingLocation(false);
    }, () => {
      alert("Unable to retrieve your location. Please type it manually.");
      setGettingLocation(false);
    });
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, borderRadius: { xs: 0, sm: '16px 0 0 16px' } } }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Your Cart</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">Your cart is empty.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {cartItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="600">{item.name}</Typography>} 
                    secondary={item.condition} 
                  />
                  <Typography fontWeight="bold" color="primary.main">
                    KSh {item.price.toLocaleString()}
                  </Typography>
                </ListItem>
                {idx < cartItems.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {cartItems.length > 0 && (
        <Box sx={{ p: 3, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              KSh {totalAmount.toLocaleString()}
            </Typography>
          </Box>

          <form onSubmit={handleCheckout}>
            <Stack spacing={2.5}>
              <TextField 
                label="Full Name" 
                variant="outlined" 
                size="small" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                fullWidth
              />

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField 
                  label="Delivery Location" 
                  variant="outlined" 
                  size="small"
                  value={deliveryLocation}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  required
                  fullWidth
                  placeholder="e.g. Nairobi CBD..."
                />
                <Button 
                  variant="tonal" // Note: Will fallback to standard styles if not defined, but using standard props below
                  sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', minWidth: '40px', p: 1 }}
                  onClick={fetchLiveLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? <CircularProgress size={24} color="inherit" /> : <LocationOnIcon />}
                </Button>
              </Stack>

              <TextField 
                label="M-Pesa Number" 
                variant="outlined" 
                size="small" 
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                fullWidth
                placeholder="07..."
              />
              
              <Button 
                type="submit" 
                variant="contained"
                color="success"
                size="large"
                disabled={isCheckingOut}
                startIcon={isCheckingOut ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                sx={{ mt: 1, py: 1.5, fontWeight: 'bold' }}
              >
                {isCheckingOut ? 'Firing STK Push...' : 'Check Out with M-Pesa'}
              </Button>
            </Stack>
          </form>
        </Box>
      )}
    </Drawer>
  );
}

export default CartDrawer;
