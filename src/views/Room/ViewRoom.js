import React from 'react';
import { Container, Typography, Box, Card, Grid, ImageList, ImageListItem } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const ViewRoom = () => {

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [roomDetail, setRoomDetails] = useState(null);

  const location = useLocation();
  console.log("location=>",location);
  const pathname = location.pathname;

  // Split the pathname by slashes and get the last part
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  console.log("navigate id==>",id);

  useEffect(()=>{
    const fetchRoomDetails = async () => {
      try{
        console.log("URL =>",`${REACT_APP_BACKEND_URL}/room/view/${id}`);
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/room/view/${id}`);
        console.log("response==>",response);
        setRoomDetails(response.data.result);
      }catch(error){
        console.error("Error fetching reserved student details:", error);
      }
    }
    fetchRoomDetails();
  },[id]);
  console.log("roomDetail==>",roomDetail);


  return (
    <Container>
      <Box mb={2} display="flex" alignItems="center">
        <Link to="/dashboard/room" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ArrowBack style={{ marginRight: '8px' }} />
        </Link>
        <Typography variant="h4">View Room Details</Typography>
      </Box>

      <Card>
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Room Number:</strong> {roomDetail?.roomNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Room Type:</strong> {roomDetail?.roomType}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Total No.of Beds:</strong> {roomDetail?.numOfBeds}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Occupied Beds:</strong> {roomDetail?.occupiedBeds}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Available Beds:</strong> {roomDetail?.availableBeds}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Box mt={3}>
        <Card>
          <Box p={3}>
            <Typography variant="body1" gutterBottom>
              <strong>Room Images</strong>
            </Typography>
            <ImageList cols={3} rowHeight={164} gap={8}>
              {roomDetail?.roomphoto.map((image, index) => (
                <ImageListItem key={index}>
                  <img src={`${REACT_APP_BACKEND_URL}/uploads/RoomImages/${roomDetail.roomphoto[index]}`} alt={`Room ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default ViewRoom;


