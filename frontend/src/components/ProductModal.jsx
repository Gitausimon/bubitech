import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ height: 250, bgcolor: 'background.default', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, p: 2 }}>
          {product.imageUrl ? (
            <Box component="img" src={product.imageUrl} alt={product.name} sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
            <Typography color="text.secondary">No Image Available</Typography>
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4}>
            <Typography variant="caption" color="text.secondary">Brand</Typography>
            <Typography variant="body1" fontWeight="500">{product.brand}</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="caption" color="text.secondary">Condition</Typography>
            <Typography variant="body1" fontWeight="500">{product.condition}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary">Price</Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">KSh {product.price.toLocaleString()}</Typography>
          </Grid>
        </Grid>

        {product.hardwareSpecs && Object.keys(product.hardwareSpecs).length > 0 && (
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Detailed Specifications</Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(product.hardwareSpecs).map(([key, value]) => {
              if (key === 'phone_name' || key === 'brand' || key === 'thumbnail' || key === 'name') return null;
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}: 
                    </Typography>
                    <Typography component="span" sx={{ ml: 1 }}>
                      {Object.values(value).join(' / ')}
                    </Typography>
                  </Box>
                );
              }
              if (typeof value === 'string' || typeof value === 'number') {
                return (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}: 
                    </Typography>
                    <Typography component="span" sx={{ ml: 1 }}>
                      {value}
                    </Typography>
                  </Box>
                )
              }
              return null;
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Close</Button>
        <Button 
          onClick={() => {
            onAddToCart(product);
            onClose();
          }} 
          variant="contained" 
          color="primary"
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductModal;
