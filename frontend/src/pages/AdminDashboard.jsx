import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Divider, Avatar } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

function AdminDashboard() {
  const [data, setData] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [specs, setSpecs] = useState(null);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  
  const [deployPrice, setDeployPrice] = useState(15000);
  const [deployCondition, setDeployCondition] = useState('New');
  const [deployImage, setDeployImage] = useState('');
  
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    name: '', brand: '', price: 15000, condition: 'New', imageUrl: '', ram: '', storage: '', battery: '', os: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics')
      .then(res => res.json())
      .then(json => setData(json.data || null));
  }, []);

  const searchMicroservice = () => {
    if (!searchQuery.trim()) return alert("Please type a phone name first!");
    
    setLoadingSpecs(true);
    fetch(`http://localhost:4000/search?query=${encodeURIComponent(searchQuery.trim())}`)
      .then(async res => {
          if(!res.ok) throw new Error(await res.text());
          return res.json();
      })
      .then(async searchResults => {
         if(Array.isArray(searchResults) && searchResults.length > 0) {
            const firstResult = searchResults[0];
            const slug = firstResult.slug;
            
            const specRes = await fetch(`http://localhost:4000/${slug}`);
            if(!specRes.ok) throw new Error("Could not pull detailed specs");
            const specData = await specRes.json();
            
            setSpecs({
               thumbnail: firstResult.imageUrl,
               phone_name: firstResult.name,
               ...specData
            });
         } else {
            alert("No specs found for that exact name on the GSM registry!");
            setSpecs(null);
         }
         setLoadingSpecs(false);
      })
      .catch(err => {
         console.error('Microservice error:', err);
         alert(`Microservice connection failed: ${err.message}`);
         setLoadingSpecs(false);
      });
  }

  const saveProduct = () => {
    if (isManualMode) {
      if (!manualData.name.trim() || !manualData.brand.trim()) return alert("Name and Brand are required!");
      const productData = {
         name: manualData.name,
         brand: manualData.brand,
         price: Number(manualData.price),
         condition: manualData.condition,
         imageUrl: manualData.imageUrl,
         hardwareSpecs: {
            Memory: { internal: `${manualData.storage} ${manualData.ram}`.trim() },
            Battery: { type: manualData.battery },
            Platform: { os: manualData.os }
         }
      };

      fetch('http://localhost:5000/api/products', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(productData)
      }).then(res => res.json()).then(data => {
         alert("✅ Manual Product Successfully Committed to Live Database!");
         setManualData({ name: '', brand: '', price: 15000, condition: 'New', imageUrl: '', ram: '', storage: '', battery: '', os: '' });
      }).catch(err => alert("Error saving to database."));
      return;
    }

    if (!searchQuery && !specs) return alert("Search for a product first!");
    const productData = {
       name: specs ? specs.phone_name : searchQuery,
       brand: specs ? (specs.brand || "Unknown") : "Unknown",
       price: Number(deployPrice),
       condition: deployCondition,
       imageUrl: deployImage,
       hardwareSpecs: specs ? specs : {}
    };

    fetch('http://localhost:5000/api/products', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(productData)
    }).then(res => res.json()).then(data => {
       alert("✅ Product Successfully Committed to Live Database!");
       setSpecs(null);
       setSearchQuery('');
    }).catch(err => alert("Error saving to database."));
  }

  if (!data) return <Box sx={{ p: 4 }}><Typography>Loading Analytics...</Typography></Box>;

  const maxSale = Math.max(...data.weeklySalesChart.map(d => d.value));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
          Business Analytics
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Owner Dashboard & Inventory Tools
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: "Today's Sales", value: `KSh ${data.todaysSales.toLocaleString()}`, color: 'primary.main' },
          { label: "Orders", value: data.ordersCount, color: 'text.primary' },
          { label: "Repairs", value: data.repairsCount, color: 'text.primary' },
          { label: "Estimated Profit", value: `KSh ${data.estimatedProfit.toLocaleString()}`, color: 'success.main' }
        ].map(kpi => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" fontWeight="500" gutterBottom>
                  {kpi.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: kpi.color, mt: 1 }}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Inventory Injection */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Deploy New Product to Shop</Typography>
                <FormControlLabel
                  control={<Switch checked={isManualMode} onChange={e => setIsManualMode(e.target.checked)} color="primary" />}
                  label={<Typography variant="body2" fontWeight="500">Manual Override</Typography>}
                />
              </Box>
              
              {!isManualMode ? (
                <Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField 
                      fullWidth
                      label="Auto-fetch spec (ex: Samsung Galaxy S23)"
                      variant="outlined"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={searchMicroservice}
                      disabled={loadingSpecs}
                      sx={{ whiteSpace: 'nowrap', px: 4 }}
                    >
                      {loadingSpecs ? 'Pinging...' : 'Fetch Spec'}
                    </Button>
                  </Box>

                  {specs && (
                    <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {specs.thumbnail && <Avatar variant="rounded" src={specs.thumbnail} alt={specs.phone_name} sx={{ width: 64, height: 64 }} />}
                        <Box>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">{specs.phone_name || specs.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{specs.brand || "Unknown"}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', maxHeight: 300, overflowY: 'auto' }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Detailed Specifications</Typography>
                        {Object.entries(specs).map(([key, value]) => {
                          if (key === 'phone_name' || key === 'brand' || key === 'thumbnail' || key === 'name') return null;
                          
                          if (typeof value !== 'object' && value !== null) {
                             return (
                               <Box key={key} sx={{ display: 'flex', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                                 <Typography variant="body2" fontWeight="600" sx={{ flex: 1, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</Typography>
                                 <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>{value}</Typography>
                               </Box>
                             )
                          }
                          
                          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                             return (
                                <Box key={key} sx={{ mt: 2 }}>
                                   <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ textTransform: 'capitalize', mb: 1 }}>{key.replace(/_/g, ' ')}</Typography>
                                   <Box sx={{ pl: 2 }}>
                                      {Object.entries(value).map(([subK, subV], idx) => (
                                         <Box key={idx} sx={{ display: 'flex', gap: 2, py: 0.5, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                            <Typography variant="caption" fontWeight="bold" sx={{ width: 100, textTransform: 'capitalize' }}>{subK}</Typography>
                                            <Typography variant="caption" color="text.secondary">{String(subV)}</Typography>
                                         </Box>
                                      ))}
                                   </Box>
                                </Box>
                             )
                          }
                          
                          if (Array.isArray(value)) {
                             return (
                                <Box key={key} sx={{ mt: 2 }}>
                                   <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ textTransform: 'capitalize', mb: 1 }}>{key.replace(/_/g, ' ')}</Typography>
                                   <Box sx={{ pl: 2 }}>
                                      {value.map((item, idx) => typeof item === 'object' && item !== null ? (
                                        <Box key={idx} sx={{ mb: 1, pb: 1, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                           <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 0.5 }}>{item.title || item.name || ''}</Typography>
                                           {Array.isArray(item.specs) ? item.specs.map((s, i) => (
                                             <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                                <Typography variant="caption" fontWeight="bold" sx={{ width: 100 }}>{s.key}</Typography>
                                                <Typography variant="caption" color="text.secondary">{s.val}</Typography>
                                             </Box>
                                           )) : (
                                             <Typography variant="caption" color="text.secondary">{JSON.stringify(item)}</Typography>
                                           )}
                                        </Box>
                                      ) : (
                                        <Typography key={idx} variant="caption" display="block">{String(item)}</Typography>
                                      ))}
                                   </Box>
                                </Box>
                             )
                          }
                         })}
                      </Box>
                      
                      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                         <TextField fullWidth label="Price (KSh)" type="number" value={deployPrice} onChange={e => setDeployPrice(e.target.value)} size="small" />
                         <FormControl fullWidth size="small">
                            <InputLabel>Condition</InputLabel>
                            <Select value={deployCondition} label="Condition" onChange={e => setDeployCondition(e.target.value)}>
                              <MenuItem value="New">New</MenuItem>
                              <MenuItem value="Refurbished">Refurbished</MenuItem>
                              <MenuItem value="Used">Used</MenuItem>
                            </Select>
                         </FormControl>
                         <TextField fullWidth label="Override Image URL" value={deployImage} onChange={e => setDeployImage(e.target.value)} size="small" />
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                       <TextField fullWidth label="Product Name *" value={manualData.name} onChange={e => setManualData({...manualData, name: e.target.value})} size="small" />
                       <TextField fullWidth label="Brand *" value={manualData.brand} onChange={e => setManualData({...manualData, brand: e.target.value})} size="small" />
                    </Box>
                    <Box>
                       <TextField fullWidth label="Image URL (Optional)" value={manualData.imageUrl} onChange={e => setManualData({...manualData, imageUrl: e.target.value})} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                       <TextField fullWidth label="Price (KSh)" type="number" value={manualData.price} onChange={e => setManualData({...manualData, price: e.target.value})} size="small" />
                       <FormControl fullWidth size="small">
                          <InputLabel>Condition</InputLabel>
                          <Select value={manualData.condition} label="Condition" onChange={e => setManualData({...manualData, condition: e.target.value})}>
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Refurbished">Refurbished</MenuItem>
                            <MenuItem value="Used">Used</MenuItem>
                          </Select>
                       </FormControl>
                    </Box>
                    
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Hardware Basics (Optional)</Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                       <TextField fullWidth label="RAM (e.g. 8GB)" value={manualData.ram} onChange={e => setManualData({...manualData, ram: e.target.value})} size="small" />
                       <TextField fullWidth label="Storage (e.g. 256GB)" value={manualData.storage} onChange={e => setManualData({...manualData, storage: e.target.value})} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                       <TextField fullWidth label="Battery (e.g. 5000 mAh)" value={manualData.battery} onChange={e => setManualData({...manualData, battery: e.target.value})} size="small" />
                       <TextField fullWidth label="OS (e.g. Android 13)" value={manualData.os} onChange={e => setManualData({...manualData, os: e.target.value})} size="small" />
                    </Box>
                 </Box>
              )}

              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={saveProduct}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                Commit to Database
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Sales Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">Weekly Sales</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 250, mt: 4 }}>
                {data.weeklySalesChart.map(day => (
                  <Box key={day.day} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: '100%', 
                      height: `${maxSale > 0 ? (day.value / maxSale) * 100 : 0}%`, 
                      bgcolor: 'secondary.main', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease-in-out'
                    }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontWeight: 'bold' }}>
                      {day.day}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
