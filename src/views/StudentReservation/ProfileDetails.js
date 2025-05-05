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
  CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const ProfileDetails = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [visitorData, setVisitorData] = useState([]);
  const [totalVisitorCount, setTotalVisitorCount] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [studentName, setStudentName] = useState('');

  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  console.log('student id :', id);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchStudentDetails();
    fetchStudentPaymentData();
    fetchVisitorData();
  }, [id]);

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
  console.log('profileData===>', profileData);

  const fetchStudentPaymentData = async () => {
    try {
      console.log('Making API With This URL==>', `${REACT_APP_BACKEND_URL}/student_payment/paymenthistory/${id}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/paymenthistory/${id}`);
      console.log('API Payment Data response=>', response);
      setPaymentData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching student payment details:', error);
    }
  };

  const fetchVisitorData = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/visitor/list/${id}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/visitor/list/${id}`);
      console.log(' fetchVisitorData response===>', response);
      setVisitorData(response.data.result);
      setTotalVisitorCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching visitors data:', error);
    }
  };

  console.log('visitorData===>', visitorData);
  console.log('paymentData===>', paymentData);
  console.log('studentName===>', studentName);

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

  const columns = [
    {
      field: 'month',
      headerName: 'Month',
      flex: 1
    },
    {
      field: 'paymentDate',
      headerName: 'Date',
      flex: 1
    },
    {
      field: 'paidAmount',
      headerName: 'Monthly Paid Amount',
      flex: 1
    },
    {
      field: 'monthlyPending',
      headerName: 'Monthly Pending Amount',
      flex: 1
    },
    {
      field: 'totalAmmount',
      headerName: 'Total Amount',
      flex: 1
    },
    {
      field: 'totalPending',
      headerName: 'Total Pending Amount',
      flex: 1
    },
    {
      field: 'paymentType',
      headerName: 'Payment Method',
      flex: 1
    },
    {
      field: 'paymentAttachment',
      headerName: 'Attachment',
      flex: 1
    },
    {
      field: 'Status',
      headerName: 'Total Amount',
      flex: 1
    }
  ];

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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '0px' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Profile Details" />
            <Tab label="Payment History" />
            <Tab label="Visitor History" />
          </Tabs>
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
                      <Typography variant="h6">Room Number:</Typography>
                      <Typography>{profileData?.roomNumber || '- -'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">Room Type:</Typography>
                      <Typography>{profileData?.roomType || '- -'} seater</Typography>
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
                      <Typography variant="h6">Total Rent till EndMonth:</Typography>
                      <Typography>{profileData?.totalRent || '- -'}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="h6">Advance Payment:</Typography>
                      <Typography>{profileData?.advanceAmount || '- -'}</Typography>
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
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <>
          <TableStyle>
            <Box width="100%" sx={{ mt: '10px' }}>
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Monthly Paid Amount</TableCell>
                        <TableCell>Monthly Pending Amount</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Total Pending Amount</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Attachment</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paymentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{moment(row.paymentDate).format('DD-MM-YYYY')}</TableCell>
                          <TableCell>{row.paidAmount}</TableCell>
                          {row.monthlyPending > 0 ? (
                            <>
                              <TableCell sx={{ color: 'red' }}>{row.monthlyPending}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{row.monthlyPending}</TableCell>
                            </>
                          )}
                          <TableCell>{row.totalAmmount}</TableCell>
                          <TableCell>{row.totalPending}</TableCell>
                          <TableCell>{row.paymentType}</TableCell>
                          <TableCell>
                            {row.paymentAttachment && (
                              <a
                                href={`${REACT_APP_BACKEND_URL}/uploads/payment/${row.paymentAttachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {row.paymentAttachment}
                              </a>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center">
                              {row.monthlyPending > 0 ? (
                                <Typography variant="body2" color="red">
                                  Pending
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="green">
                                  Complete
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Box>
          </TableStyle>

          {/* <TableStyle>
            <Box width="100%">
              <Card style={{ height: '600px', paddingTop: '15px' }}>
                {paymentData && (
                  <DataGrid
                    rows={paymentData}
                    columns={columns}
                    getRowId={(row) => row?._id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                  />
                )}
              </Card>
            </Box>
          </TableStyle> */}
        </>
      )}

      {activeTab === 2 && (
        <>
          <TableStyle>
            <Box width="100%" sx={{ mt: '10px' }}>
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone No.</TableCell>
                        <TableCell>Date & Time</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {visitorData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.visitorName}</TableCell>
                          <TableCell>{row.phoneNumber}</TableCell>
                          <TableCell>{moment(row.dateTime).format('DD-MM-YYYY HH:mm')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
              </Card>
            </Box>
          </TableStyle>
        </>
      )}
    </Container>
  );
};
export default ProfileDetails;
