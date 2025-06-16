import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const inventoryData = [
  { productName: 'Rice', purchased: 100, consumed: 60, remaining: 40 },
  { productName: 'Oil', purchased: 50, consumed: 30, remaining: 20 },
  { productName: 'Flour', purchased: 80, consumed: 45, remaining: 35 },
  { productName: 'Sugar', purchased: 70, consumed: 50, remaining: 20 },
  { productName: 'Milk', purchased: 90, consumed: 70, remaining: 20 },
  { productName: 'Wheat', purchased: 120, consumed: 100, remaining: 20 },
  { productName: 'Tea', purchased: 60, consumed: 50, remaining: 10 },
  { productName: 'Coffee', purchased: 40, consumed: 30, remaining: 10 },
  { productName: 'Salt', purchased: 90, consumed: 60, remaining: 30 },
  { productName: 'Spices', purchased: 80, consumed: 50, remaining: 30 }
];

export default function InventoryDashboard() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [reportData, setReportData] = useState([]);
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleTabChange = (_, newValue) => setTab(newValue);

  useEffect(() => {
    const fetchReportsData = async () => {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory/inventoryReport`);

      setReportData(response?.data?.inventoryData);
    };
    fetchReportsData();
  }, []);


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Canteen Inventory Dashboard
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Overview" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              All Products Inventory
            </Typography>

            {/* Horizontal scroll container */}
            <Box sx={{ overflowX: 'auto' }}>
              {/* Chart container with responsive width + enough height */}
              <Box sx={{ width: Math.max(800, reportData?.length * 100), height: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="productName" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="purchased" fill={theme.palette.primary.main} name="Purchased" />
                    <Bar dataKey="consumed" fill={theme.palette.error.main} name="Consumed" />
                    <Bar dataKey="remaining" fill={theme.palette.success.main} name="Remaining" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
