import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Grid, IconButton, Tabs, Tab, Button, Chip, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableStyle from '../../ui-component/TableStyle';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const ViewHostel = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [hostelDetails, setHostelDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/view/${id}`);
        setHostelDetails(response?.data?.result);
      } catch (error) {
        console.error('Error fetching hostel details:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/getAllReservedStudents/${id}`);
        console.log('this is in tab  student response -->', response);
        setStudents(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchHostelDetails();
    fetchStudents();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNavigate = (id) => {
    navigate(`/dashboard/student_reservation/view_profile/${id}`);
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S. No.',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'roomNumber',
      headerName: 'Room Number',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {params.row.roomNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.roomType}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {params.row.studentId?.studentName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.studentId?.studentContact}
            </Typography>
          </Box>
        );
      }
    },

    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      renderCell: (params) => {
        return params.row.studentId?.mailId;
      }
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params.value).format('DD-MM-YYYY')}</Box>;
      }
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params.value).format('DD-MM-YYYY')}</Box>;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const status = params.row.studentId?.status;
        const isActive = status === 'active';

        return (
          <Chip
            label={params.row.studentId?.status}
            color={isActive ? 'success' : 'error'}
            variant="outlined"
            size="small"
            style={{ textTransform: 'capitalize', fontWeight: 500 }}
          />
        );
      }
    }
  ];

  const studentRows = students.map((student, index) => ({
    id: index + 1,
    name: student.name,
    email: student.email,
    phone: student.phone
  }));

  return (
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
          <IconButton onClick={() => navigate('/superadmindashboard/default')}>
            <HomeIcon color='primary'/>
          </IconButton>
          <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
          <IconButton onClick={() => navigate(`/superadmindashboard/hostel`)}>
            <Typography variant="h5">Hostel List</Typography>
          </IconButton>
          <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
          <Typography variant="h5">Hostel Details</Typography>
        </Stack>

        <Button variant="contained" color="primary" size="small" onClick={() => navigate(-1)} startIcon={<ArrowBackIosIcon />}>
          Back
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Hostel & Owner Info" />
        <Tab label="Student List" />
      </Tabs>

      {tabValue === 0 && hostelDetails && (
        <Box mt={2}>
          {/* Hostel & Owner Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box p={3}>
                <Typography variant="h4" fontWeight="bold">
                  Hostel & Owner Information
                </Typography>
                <hr />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">Hostel Name:</Typography>
                    <Typography>{hostelDetails?.hostelName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Hostel ContactNo:</Typography>
                    <Typography>{hostelDetails?.hostelPhoneNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Owner Name:</Typography>
                    <Typography>{hostelDetails?.ownerName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Owner ContactNo:</Typography>
                    <Typography>{hostelDetails?.ownerPhoneNumber || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h6">Owner EmailId:</Typography>
                    <Typography>{hostelDetails?.email || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Address:</Typography>
                    <Typography>{hostelDetails?.address || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">View Hostel Photo:</Typography>
                    <Typography style={{ color: 'black', marginTop: '7px' }}>
                      <a
                        href={`${REACT_APP_BACKEND_URL}${hostelDetails?.hostelphoto}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <Button startIcon={<VisibilityIcon />} variant="contained" color="primary">
                          View Id Photo
                        </Button>
                      </a>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">View AadharId Proof:</Typography>
                    <Typography style={{ color: 'black', marginTop: '7px' }}>
                      <a
                        href={`${REACT_APP_BACKEND_URL}${hostelDetails?.aadharphoto}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <Button startIcon={<VisibilityIcon />} variant="contained" color="primary">
                          View Id Photo
                        </Button>
                      </a>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              {students && (
                <DataGrid
                  rows={students}
                  columns={columns}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                />
              )}
            </Card>
          </Box>
        </TableStyle>
      )}
    </Container>
  );
};

export default ViewHostel;
