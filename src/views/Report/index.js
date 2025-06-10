import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Tabs,
  Grid,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  Tab,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Card,
  styled,
  IconButton,
  Button,
  TextField,
  Chip
} from '@mui/material';
import Iconify from '../../ui-component/iconify';
import moment from 'moment';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BedIcon from '@mui/icons-material/Bed';
import PaymentIcon from '@mui/icons-material/Payment';
import Cookies from 'js-cookie';
import axios from 'axios';

const TabContentCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[1],
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2.4)
}));

const Report = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const [studentRoomData, setStudentsData] = useState([]);
  const [hostelId, setHostelId] = useState();
  const [studentPaymentData, setStudentPaymentData] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredRoomRows = studentRoomData.filter((row) => {
    const rowDate = new Date(row.createdAt);

    const normalizedStartDate = startDate ? new Date(startDate) : null;
    const normalizedEndDate = endDate ? new Date(endDate) : null;

    if (normalizedStartDate) {
      normalizedStartDate.setHours(0, 0, 0, 0);
    }

    if (normalizedEndDate) {
      normalizedEndDate.setHours(23, 59, 59, 999);
    }

    return (!normalizedStartDate || normalizedStartDate <= rowDate) && (!normalizedEndDate || rowDate <= normalizedEndDate);
  });

  const filteredPaymentRows = studentPaymentData.filter((row) => {
    const rowDate = new Date(row.createdAt);

    const normalizedStartDate = startDate ? new Date(startDate) : null;
    const normalizedEndDate = endDate ? new Date(endDate) : null;

    if (normalizedStartDate) {
      normalizedStartDate.setHours(0, 0, 0, 0);
    }

    if (normalizedEndDate) {
      normalizedEndDate.setHours(23, 59, 59, 999);
    }

    return (!normalizedStartDate || normalizedStartDate <= rowDate) && (!normalizedEndDate || rowDate <= normalizedEndDate);
  });

  const fetchStudents = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/getAllReservedStudents/${hostelId}`);
      setStudentsData(response?.data?.data);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const fetchPaymentData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/list/${hostelId}`);
      setStudentPaymentData(response.data.result);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchStudents(Hos_Id);
    fetchPaymentData(Hos_Id);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    setSelectedDateRange(event.target.value);
  };

  const columnsRoom = [
    {
      field: 'sno',
      headerName: 'S. No.',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1,
      renderCell: (params) => params.row.studentId?.studentName
    },
    {
      field: 'studentContact',
      headerName: 'Student Contact',
      flex: 1,
      renderCell: (params) => params.row.studentId?.studentContact
    },
    {
      field: 'roomNumber',
      headerName: 'Room No',
      flex: 1,
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
      field: 'bedNumber',
      headerName: 'Beds No',
      flex: 1
    },
    {
      field: 'roomRent',
      headerName: 'Room Price',
      flex: 1
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
    }
  ];

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    fetchStudents(hostelId);
    fetchPaymentData(hostelId);
  };

  const columnsPayment = [
    {
      field: 'sno',
      headerName: 'S. No.',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1,
      renderCell: (params) => {
        const name = params.row.studentData?.studentName || '';
        const contact = params.row.studentData?.studentContact || '';

        return (
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {contact}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'roomNumber',
      headerName: 'Room Number',
      flex: 1,
      renderCell: (params) => params.row.bedData?.roomNumber || ''
    },

    {
      field: 'date',
      headerName: 'Payment Date',
      flex: 1,
      renderCell: (params) => moment(params.row.date).format('YYYY-MM-DD') || ''
    },

    {
      field: 'totalRent',
      headerName: 'Total Rent',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.totalRent}` || 0
    },

    {
      field: 'paidAmount',
      headerName: 'Paid Amount',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.paymentAmount}` || 0
    },
    {
      field: 'remainingAmount',
      headerName: 'Pending Amount',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.remainingAmount}` || 0
    },

    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      flex: 1,
      renderCell: (params) => {
        const status = params.row.paymentStatus || 'Pending';
        const isPending = status.toLowerCase() === 'pending';

        return (
          <Chip
            label={status}
            color={isPending ? 'error' : 'success'}
            variant="outlined"
            size="small"
            sx={{
              width: '100px',
              justifyContent: 'center',
              textTransform: 'capitalize'
            }}
          />
        );
      }
    }
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <GridToolbarQuickFilter
          placeholder="Search..."
          style={{
            width: '250px',
            backgroundColor: '#ffff',
            borderRadius: '8px',
            padding: '5px 10px',
            border: '1px solid beige'
          }}
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl
            sx={{
              width: '120px',
              height: '40px'
            }}
          >
            <Select
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              sx={{
                width: '120px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ffffff'
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Last 7 Days">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          {/* <GridToolbarExport style={{ fontSize: 14 }} /> */}
        </Stack>
      </GridToolbarContainer>
    );
  };

  return (
    <Grid>
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
          <Typography variant="h5">Report</Typography>
        </Stack>
        {/* 
        <Stack direction="row" alignItems="center" spacing={2}>
          <Card>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Report
            </Button>
          </Card>
        </Stack> */}
      </Box>

      <TabContentCard>
        {/* <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs">
          <Tab
            icon={<BedIcon />}
            iconPosition="start"
            label="Rooms"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 0 ? '#1976d2' : '#757070'
            }}
          />
          <Tab
            icon={<PaymentIcon />}
            iconPosition="start"
            label="Payment"
            sx={{
              fontSize: '14px',
              minWidth: 120,
              fontWeight: 'bold',
              textTransform: 'none',
              color: selectedTab === 1 ? '#1976d2' : '#757070'
            }}
          />
        </Tabs> */}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="product report tabs">
            <Tab
              icon={<BedIcon />}
              iconPosition="start"
              label="Rooms"
              sx={{
                fontSize: '14px',
                minWidth: 120,
                fontWeight: 'bold',
                textTransform: 'none',
                color: selectedTab === 0 ? '#1976d2' : '#757070'
              }}
            />
            <Tab
              icon={<PaymentIcon />}
              iconPosition="start"
              label="Payment"
              sx={{
                fontSize: '14px',
                minWidth: 120,
                fontWeight: 'bold',
                textTransform: 'none',
                color: selectedTab === 1 ? '#1976d2' : '#757070'
              }}
            />
          </Tabs>

          {/* Date Filters */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={() => handleReset()}>
              Reset
            </Button>
          </Stack>
        </Box>

        {selectedTab === 0 && (
          <Box sx={{ height: '600px', padding: '0px 5px' }}>
            <DataGrid
              rows={filteredRoomRows}
              columns={columnsRoom}
              rowHeight={60}
              getRowId={(row) => row?._id}
              //   components={{ Toolbar: CustomToolbar }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 }
                }
              }}
              pagination
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                }
              }}
            />
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ height: '600px', padding: '0px 5px' }}>
            <DataGrid
              rows={filteredPaymentRows}
              columns={columnsPayment}
              rowHeight={60}
              getRowId={(row) => row?._id}
              //   components={{ Toolbar: CustomToolbar }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 }
                }
              }}
              pagination
              sx={{
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                },
                border: 0
              }}
            />
          </Box>
        )}
      </TabContentCard>
    </Grid>
  );
};

export default Report;
