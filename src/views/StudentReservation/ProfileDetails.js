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

const ProfileDetails = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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
  console.log('location=>', location);
  const pathname = location.pathname;

  // Split the pathname by slashes and get the last part
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  console.log('id in profile componenet  ==>', id);

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
      console.log('Making API With This URL==>', `${REACT_APP_BACKEND_URL}/sudent_reservation/view/${id}`);
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
      <Box mb={1} display="flex" alignItems="center">
        <Link to="/dashboard/student_reservation" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton edge="start" color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h4">View all Details of {studentName}</Typography>
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
        <>
          <Card style={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px', marginTop: '10px' }}>
            <Box p={3}>
              <Typography variant="h4">Profile Details</Typography>
              {profileData && (
                <Grid container spacing={4} style={{ marginTop: '1vh' }}>
                  <Grid item xs={12} sm={4}>
                    {[
                      { label: 'Student Name', value: profileData.studentName },
                      { label: 'Student PhoneNo', value: profileData.studentPhoneNo },
                      { label: 'Email Id', value: profileData.email },
                      { label: 'Date Of Birth', value: moment(profileData.dateOfBirth).format('DD-MM-YYYY') },
                      { label: 'Gender', value: profileData.gender },
                      { label: 'Fathers Name', value: profileData.fathersName },
                      { label: 'Fathers PhoneNo', value: profileData.fathersPhoneNo },
                      { label: 'Address', value: profileData.address + '   ' + profileData.city + ' ' + profileData.state },
                      { label: 'Start Date', value: moment(profileData.startDate).format('DD-MM-YYYY') },
                      { label: 'End Date', value: moment(profileData.endDate).format('DD-MM-YYYY') }
                    ].map((info, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body1">{info.label}:</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {info.value || '--'}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    {[
                      { label: 'Room Number', value: profileData.roomNumber },
                      { label: 'Library Facility', value: profileData.isLibrary === 'true' ? 'yes' : 'no' },
                      { label: 'Food Facility', value: profileData.isFood === 'true' ? 'yes' : 'no' },
                      { label: 'Library Amount', value: profileData.libraryAmount },
                      { label: 'Food Amount', value: profileData.foodAmount },
                      { label: 'Hostel Monthly Rent:', value: profileData.hostelRent },
                      { label: 'Advance Payment', value: profileData.advancePayment },
                      { label: 'Monthly Total Rent ', value: profileData.MonthlyTotalAmmount },
                      { label: 'Total Rent till EndMonth', value: profileData.totalAmount }
                    ].map((info, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="body1">{info.label}:</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {info.value || '--'}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">Studnet Photo</Typography>
                    {profileData.studentphoto && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${REACT_APP_BACKEND_URL}/uploads/students/${profileData.studentphoto}` || 'path/to/placeholder.jpg'}
                        alt="studentphoto"
                        style={{ width: 150, height: 150, marginTop: 20, marginBottom: 20 }}
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.src = 'path/to/placeholder.jpg';
                        }}
                      />
                    )}

                    <Typography variant="h6">Studnet AadharCard Photo</Typography>
                    {profileData.aadharcardphoto && (
                      <a
                        href={`${REACT_APP_BACKEND_URL}/uploads/students/${profileData.aadharcardphoto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={`${REACT_APP_BACKEND_URL}/uploads/students/${profileData.aadharcardphoto}`}
                          alt="aadharcardphoto"
                          style={{ width: 150, height: 150, marginTop: 20, marginBottom: 20 }}
                          onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.src = 'path/to/placeholder.jpg';
                          }}
                        />
                      </a>
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          </Card>
        </>
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
