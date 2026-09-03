import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Badge, Button, Stack, Chip, CardActionArea } from '@mui/material';
import MemoryIcon from '@mui/icons-material/SdStorage';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

function ProductCard({ product, onView, onAddToCart }) {
  return (
    <Card 
      sx={{ 
        width: 280, 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardActionArea onClick={() => onView(product)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ height: 180, bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          {product.imageUrl ? (
            <Box component="img" src={product.imageUrl} alt={product.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <Typography variant="body2" color="text.secondary">No Image</Typography>
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} • {product.condition}
          </Typography>
          
          {product.hardwareSpecs && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
              {product.hardwareSpecs.Memory?.internal && (
                <Chip 
                  size="small" 
                  icon={<MemoryIcon fontSize="small" />} 
                  label={product.hardwareSpecs.Memory.internal.split(',')[0]} 
                  variant="outlined"
                />
              )}
              {product.hardwareSpecs.Battery?.type && (
                <Chip 
                  size="small" 
                  icon={<BatteryChargingFullIcon fontSize="small" />} 
                  label={product.hardwareSpecs.Battery.type.split(',')[0]} 
                  variant="outlined"
                />
              )}
            </Stack>
          )}

          <Typography variant="h5" color="primary.main" fontWeight="700" sx={{ mt: 'auto', pt: 2 }}>
            KSh {product.price.toLocaleString()}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
}

export default ProductCard;
