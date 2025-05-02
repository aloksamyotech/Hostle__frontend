import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Grid, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ViewHostel = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [hostelDetails, setHostelDetails] = useState(null);
  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/view/${id}`);
        console.log("response : ",response);
        setHostelDetails(response.data.result);
      } catch (error) {
        console.error('Error Found:', error);
      }
    };
    fetchHostelDetails();
  }, [id]);

  return (
    <Container>
      <Box mb={2} display="flex" alignItems="center">
        <Link to="/superadmindashboard/hostel" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton>
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h4">View Details of Hostel</Typography>
      </Box>

      {/* Owner Details Section */}
      {hostelDetails && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <Box p={3} display="flex">
                <Box mr={2}>
                  {hostelDetails.aadharphoto && (
                    <img
                      src={`${REACT_APP_BACKEND_URL}/uploads/customers/${hostelDetails.aadharphoto}`}
                      alt="OwnerPhoto"
                      style={{ width: 150, height: 150, borderRadius: '50%' }}
                    />
                  )}
                </Box>
                <Box mt={5}>
                  {/* <Typography variant="h5" gutterBottom>Owner Details</Typography> */}
                  <Typography variant="body1">
                    <strong>Owner Name:</strong> {hostelDetails.ownerName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone No:</strong> {hostelDetails.ownerPhoneNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {hostelDetails.email}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Hostel Details Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box p={3} display="flex">
                <Box mr={5}>
                  {hostelDetails.hostelphoto && (
                    <img
                      src={`${REACT_APP_BACKEND_URL}/uploads/hostels/${hostelDetails.hostelphoto}`}
                      alt="HostelPhoto"
                      style={{ width: 150, height: 150 }}
                    />
                  )}
                </Box>
                <Box mt={3}>
                  <Typography variant="body1">
                    <strong>Hostel Name:</strong> {hostelDetails.hostelName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone Number:</strong> {hostelDetails.hostelPhoneNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>City:</strong> {hostelDetails.city}
                  </Typography>
                  <Typography variant="body1">
                    <strong>State:</strong> {hostelDetails.state}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {hostelDetails.address}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ViewHostel;
