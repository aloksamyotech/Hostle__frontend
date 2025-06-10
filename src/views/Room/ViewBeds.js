import React from 'react';
import { Container, Stack, Typography, Grid, Box, Paper, Avatar, Chip, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { handleBreakpoints } from '@mui/system';
import { useNavigate } from 'react-router';
import ReservedBeds from './ReservedBeds';

const ViewBeds = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const location = useLocation();
  const parts = location.pathname.split('/');
  const roomId = parts[parts.length - 1];

  const [roomData, setRoomData] = useState();
  const [hostelId, setHostelId] = useState(null);
  const [open, setOpen] = useState(false);
  const [bedNo, setBedNo] = useState();

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchRoomsData(Hos_Id, roomId);
  }, [open]);

  const fetchRoomsData = async (hostelId, roomId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/room/get_roomdata/${hostelId}/${roomId}`);
      setRoomData(response.data.room);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const totalBeds = roomData?.noOfBeds || 0;

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookBedOpen = () => {
    setOpen(true);
  };

  const handleBookBedClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ReservedBeds open={open} handleClose={handleBookBedClose} roomData={roomData} bedNo={bedNo} hostelId={hostelId} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
            <Typography variant="h4">Number Of Beds ({roomData?.noOfBeds})</Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              sx={{ marginBottom: 2 }}
              onClick={() => {
                handleBack();
              }}
            >
              Back
            </Button>
          </Stack>

          {roomData?.noOfBeds > 0 ? (
            <Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: '600',
                  fontSize: '1.25rem',
                  color: '#333',
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}
              >
                Room No: {roomData?.roomNumber} | {roomData?.roomCategory} Room | {roomData?.roomType}
              </Typography>

              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                {roomData?.beds?.map((bed, index) => {
                  const isOccupied = bed.status === 'occupied';

                  return (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                      <Paper
                        elevation={4}
                        sx={{
                          borderRadius: '16px',
                          p: 2.5,
                          backgroundColor: isOccupied ? '#f5f5f5' : 'white',
                          opacity: isOccupied ? 0.6 : 1,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                          <Avatar
                            sx={{
                              bgcolor: isOccupied ? '#e57373' : '#81c784',
                              width: 60,
                              height: 60,
                              mb: 2
                            }}
                          >
                            <HotelIcon sx={{ fontSize: 32, color: 'white' }} />
                          </Avatar>

                          <Typography variant="h6" fontWeight="bold">
                            Bed {bed.bedNumber}
                          </Typography>

                          <Button
                            variant={isOccupied ? 'outlined' : 'contained'}
                            color={isOccupied ? 'error' : 'primary'}
                            sx={{ mt: 2 }}
                            onClick={() => {
                              if (!isOccupied) {
                                setBedNo(bed.bedNumber);
                                handleBookBedOpen();
                              }
                            }}
                            disabled={isOccupied}
                          >
                            {isOccupied ? 'Occupied' : 'Book Bed'}
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : (
            <Typography variant="h5" sx={{ textAlign: 'center', color: 'grey', marginTop: '5rem' }}>
              No Rooms Exist
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ViewBeds;
