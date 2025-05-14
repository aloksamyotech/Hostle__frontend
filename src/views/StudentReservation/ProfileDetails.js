import { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tab,
  Tabs,
  Grid,
  CardMedia,
  Chip,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import TableStyle from '../../ui-component/TableStyle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditStudent from './EditStudent';
import AddPayment from 'views/Payment/AddPayment';

const ProfileDetails = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [studentPaymentData, setStudentPaymentData] = useState([]);
  const [openUpdateStudent, setOpenUpdateStudent] = useState(false);

  const [paymentData, setPaymentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [visitorData, setVisitorData] = useState([]);
  const [totalVisitorCount, setTotalVisitorCount] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [studentName, setStudentName] = useState('');
  

  const [openPayment, setOpenPayment] = useState(false);

  const handleOpenPayment = () => {
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  };

  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  console.log('student id :', id);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenUpdateStudent = () => {
    setOpenUpdateStudent(true);
  };

  const handleCloseUpdateStudent = () => {
    setOpenUpdateStudent(false);
  };

  useEffect(() => {
    fetchStudentDetails();
    fetchPaymentData();
    fetchVisitorData();
  }, [id,openPayment]);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/view/${id}`);
      console.log('API fetch StudentDetails response=>', response);
      setProfileData(response.data.result);
      setStudentName(response.data.result.studentName);
    } catch (error) {
      console.error('Error fetching reserved student details:', error);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/paymenthistory/${id}`);
      console.log('response ----> fetchPaymentData ---> :', response);
      setStudentPaymentData(response.data.result);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const fetchVisitorData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/visitor/list/${id}`);
      setVisitorData(response.data.result);
    } catch (error) {
      console.error('Error fetching visitors data:', error);
    }
  };

  const columns1 = [
    {
      field: 'sno',
      headerName: 'S. No.',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'visitorName',
      headerName: 'Visitor Name',
      cellClassName: 'name-column--cell--capitalize',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Visitor Phone No',
      flex: 1
    },
    {
      field: 'visitorduration',
      headerName: 'Visit Duration (In Hr)',
      flex: 1.2,
      renderCell: (params) => {
        return `${params.row.visitorduration} hr`;
      }
    },
    {
      field: 'dateTime',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return moment(params.row.dateTime).format('YYYY-MM-DD');
      }
    }
  ];

  // Handle Pages
  const handleChangePage = (event, newPage) => {
    console.log('New Page:', newPage);
    setPage(newPage);
  };

  // Handle Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenGenerateBill = (event, row) => {
    navigate(`/paymentslip/view/${row._id}`);
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
      field: 'finalTotalRent',
      headerName: 'Final TotalRent',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.finalTotalRent}` || 0
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
    },

    {
      field: 'generateBill',
      headerName: 'Generate Bill',
      flex: 1.5,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            onClick={(event) => handleOpenGenerateBill(event, params.row)}
            sx={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#45A049'
              }
            }}
          >
            Generate Bill
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <EditStudent open={openUpdateStudent} handleClose={handleCloseUpdateStudent} profileData={profileData} />
      <AddPayment open={openPayment} handleClose={handleClosePayment} />
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
            <IconButton onClick={() => navigate(`/dashboard/student_reservation`)}>
              <Typography variant="h5">Student List</Typography>
            </IconButton>
            <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
            <Typography variant="h5">Student Details</Typography>
          </Stack>

          <Button variant="contained" color="primary" size="small" onClick={() => navigate(-1)} startIcon={<ArrowBackIosIcon />}>
            Back
          </Button>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Profile Details" />
              <Tab label="Payment History" />
              <Tab label="Visitor History" />
            </Tabs>
            <Button variant="contained" sx={{ marginLeft: 'auto' }} onClick={handleOpenPayment}>
              Add Payment
            </Button>
          </Box>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ flexGrow: 1, overflowX: 'auto', mt: 2 }}>
            <Grid container spacing={2}>
              {/* Room Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <Box p={3}>
                    <Typography variant="h4" fontWeight="bold">
                      Room Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h6">Room Number and Type:</Typography>
                        <Typography>
                          {profileData?.roomNumber && profileData?.roomType ? `${profileData.roomNumber} / ${profileData.roomType}` : '- -'}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Bed Number:</Typography>
                        <Typography>{profileData?.bedNumber || '- -'} </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Monthly Room Rent:</Typography>
                        <Typography>{profileData?.roomRent || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Total Stay Months:</Typography>
                        <Typography>{profileData?.stayMonths || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Food Amount:</Typography>
                        <Typography>{profileData?.foodFee || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Library Amount:</Typography>
                        <Typography>{profileData?.libraryFee || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Total Rent till EndMonth:</Typography>
                        <Typography>{profileData?.totalRent || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Advance Payment:</Typography>
                        <Typography>{profileData?.advanceAmount || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Discount:</Typography>
                        <Typography>{profileData?.discount || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Final Total Rent:</Typography>
                        <Typography>{profileData?.finalTotalRent || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Start Date:</Typography>
                        <Typography>{moment(profileData?.startDate).format('DD-MM-YYYY')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">End Date:</Typography>
                        <Typography>{moment(profileData?.endDate).format('DD-MM-YYYY')}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>

              {/* Student Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <Box p={3}>
                    <Typography variant="h4" fontWeight="bold">
                      Student Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h6">Student Name:</Typography>
                        <Typography>{profileData?.studentId?.studentName || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Contact No :</Typography>
                        <Typography>{profileData?.studentId?.studentContact || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Email:</Typography>
                        <Typography>{profileData?.studentId?.mailId || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Gender:</Typography>
                        <Typography>{profileData?.studentId?.gender || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">DOB:</Typography>
                        <Typography>{moment(profileData?.studentId?.dob).format('DD-MM-YYYY') || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Fathers Name:</Typography>
                        <Typography>{profileData?.studentId?.fatherName || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Fathers Phone No:</Typography>
                        <Typography>{profileData?.studentId?.fatherContact || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Address:</Typography>
                        <Typography>{profileData?.studentId?.address || '- -'}</Typography>
                      </Grid>

                      {/* Additional fields */}
                      <Grid item xs={6}>
                        <Typography variant="h6">Course/Occupation:</Typography>
                        <Typography>{profileData?.studentId?.courseOccupation || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Guardian Name:</Typography>
                        <Typography>{profileData?.studentId?.guardianName || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Guardian Contact No:</Typography>
                        <Typography>{profileData?.studentId?.guardianContactNo || '- -'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Guardian Address:</Typography>
                        <Typography>{profileData?.studentId?.guardiansAddress || '- -'}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">Student Photo:</Typography>
                        <Typography style={{ color: 'black', marginTop: '7px' }}>
                          <a
                            href={`${REACT_APP_BACKEND_URL}${profileData?.studentId?.aadharPhoto}`}
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
                      <Grid item xs={6} md={6}>
                        <Typography variant="h6">Aadhar Proof:</Typography>
                        <Typography style={{ color: 'black', marginTop: '7px' }}>
                          <a
                            href={`${REACT_APP_BACKEND_URL}${profileData?.studentId?.aadharPhoto}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                          >
                            <Button startIcon={<VisibilityIcon />} variant="contained" color="primary">
                              View Aadhar
                            </Button>
                          </a>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  sx={{ marginRight: 2, color: 'primary.main', borderColor: 'primary.main' }}
                  onClick={handleOpenUpdateStudent}
                >
                  Edit Student Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <>
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '600px', paddingTop: '15px' }}>
                  {studentPaymentData && (
                    <DataGrid
                      rows={studentPaymentData}
                      columns={columns}
                      getRowId={(row) => row?._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                    />
                  )}
                </Card>
              </Box>
            </TableStyle>
          </>
        )}

        {activeTab === 2 && (
          <>
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '600px', paddingTop: '15px' }}>
                  {visitorData && (
                    <DataGrid
                      rows={visitorData}
                      columns={columns1}
                      getRowId={(row) => row?._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                    />
                  )}
                </Card>
              </Box>
            </TableStyle>
          </>
        )}
      </Container>
    </>
  );
};
export default ProfileDetails;
