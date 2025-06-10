import React from 'react';
import { Container, Typography, Box, Card, Grid, ImageList, ImageListItem, Stack, IconButton, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const ViewRoom = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const navigate = useNavigate();
  const [roomDetail, setRoomDetails] = useState(null);

  const location = useLocation();

  const pathname = location.pathname;

  // Split the pathname by slashes and get the last part
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/room/view/${id}`);
        setRoomDetails(response.data.result);
      } catch (error) {
        console.error('Error fetching reserved student details:', error);
      }
    };
    fetchRoomDetails();
  }, [id]);

  return (
    <>
      <Container>
        <Box
          sx={{
            backgroundColor: 'white',
            height: '50px',
            width: '100%',
            display: 'flex',
            borderRadius: '10px',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 25px',
            mb: '20px'
          }}
        >
          <Stack direction="row" alignItems="center">
            <IconButton onClick={() => navigate('/dashboard/default')}>
              <HomeIcon color="primary" />
            </IconButton>
            <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
            <IconButton onClick={() => navigate(`/dashboard/room`)}>
              <Typography variant="h5">Room List</Typography>
            </IconButton>
            <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
            <Typography variant="h5">Room Details</Typography>
          </Stack>

          <Button variant="contained" color="primary" size="small" onClick={() => navigate(-1)} startIcon={<ArrowBackIosIcon />}>
            Back
          </Button>
        </Box>

        {/* Main Room Details */}
        <Card>
          <Box p={3}>
            <Typography variant="h4" fontWeight="bold">
              Room Information
            </Typography>
            <hr />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Room Number:</Typography>
                <Typography color="black">{roomDetail?.roomNumber ?? '--'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Room Type:</Typography>
                <Typography color="black">
                  {roomDetail?.roomType ?? '--'} ({roomDetail?.roomCategory ?? '--'})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Total No.of Beds:</Typography>
                <Typography color="black">{roomDetail?.noOfBeds ?? '--'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Occupied Beds:</Typography>
                <Typography color="black">{roomDetail?.occupiedBeds ?? '--'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Available Beds:</Typography>
                <Typography color="black">{roomDetail?.availableBeds ?? '--'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h5">Room Price:</Typography>
                <Typography color="black">₹ {roomDetail?.roomPrice ?? '--'}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Room Images */}
        <Box mt={3}>
          <Card>
            <Box p={3}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Room Images
              </Typography>
              <ImageList cols={3} rowHeight={164} gap={8}>
                {roomDetail?.roomphoto?.length > 0 ? (
                  roomDetail.roomphoto.map((image, index) => (
                    <ImageListItem key={index}>
                      <img src={`${REACT_APP_BACKEND_URL}${image}`} alt={`Room ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                    </ImageListItem>
                  ))
                ) : (
                  <Typography>No images available</Typography>
                )}
              </ImageList>
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default ViewRoom;
