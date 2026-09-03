import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Badge, IconButton, Grid, Container, CircularProgress } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';

function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if(data && data.data) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch failed, using fallback data', err);
        setProducts([
          { _id: '1', name: 'Samsung Galaxy A15', brand: 'Samsung', price: 18500, condition: 'New' },
          { _id: '2', name: 'iPhone 13 Pro', brand: 'Apple', price: 85000, condition: 'Used' },
          { _id: '3', name: 'Galaxy A15 Screen Protector', brand: 'Generic', price: 500, condition: 'New' },
          { _id: '4', name: 'Samsung A54 Display Module', brand: 'Samsung', price: 7500, condition: 'New'}
        ]);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const checkOutCart = async (phoneNumber, totalAmount, customerName, deliveryLocation) => {
    setIsCheckingOut(true);
    try {
      const payload = {
        cart: cartItems.map(item => ({ productId: item._id, name: item.name, price: item.price, quantity: 1 })),
        totalAmount,
        paymentMethod: 'MPesa',
        phoneNumber,
        customerName,
        deliveryLocation
      };
      
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if(data.success) {
        alert("✅ STK Push sent to " + phoneNumber + "! Complete the payment on your phone.");
        setCartItems([]);
        setIsCartOpen(false);
      } else {
        alert("Checkout failed: " + data.message);
      }
    } catch(err) {
      alert("Checkout connection error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Bubi Tech
          </Typography>
          
          <IconButton color="primary" onClick={() => setIsCartOpen(true)} size="large">
            <Badge badgeContent={cartItems.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Shop Devices
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Find your next phone, accessory, or replacement part.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ProductCard 
                    product={product} 
                    onView={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={handleAddToCart}
      />
      
      <CartDrawer 
        cartItems={cartItems} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        checkOutCart={checkOutCart}
        isCheckingOut={isCheckingOut}
      />
    </Box>
  );
}

export default Storefront;
