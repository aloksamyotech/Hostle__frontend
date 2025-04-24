// import {
//   Autocomplete, Stack, TextField, Button, Container, Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
// } from '@mui/material';
// import TableStyle from '../../ui-component/TableStyle';
// import Iconify from '../../ui-component/iconify';
// import { EditOutlined, VisibilityOutlined, DeleteOutline, PaymentOutlined } from '@mui/icons-material';
// import AddPayment from './AddPayment';
// import { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import moment from 'moment';
// import { fontSize } from '@mui/system';
// import { styled } from '@mui/material/styles';

// const PaymentList = () => {
//   const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

//   const [openAddPayment, setOpenAddPayment] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [hostelId, setHostelId] = useState();
//   const [studentPaymentData, setStudentPaymentData] = useState([]);
//   const [paymentRecordsCount, setPaymentRecords] = useState(0);
//   const [currentStudent, setCurrentStudent] = useState(null);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     const Hos_Id = Cookies.get('_Id');
//     if (Hos_Id) {
//       setHostelId(Hos_Id);
//     }
//     fetchPaymentData(Hos_Id);
//   }, []);

//   // Fetch All Payment Data Here
//   const fetchPaymentData = async (hostelId) => {
//     try {
//       const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/list/${hostelId}`);
//       setStudentPaymentData(response.data.result);
//       setPaymentRecords(response.data.totalRecodes);
//     } catch (error) {
//       console.error("Error fetching payment data:", error);
//     }
//   }

//   const handleOpenAdd = () => {
//     setOpenAddPayment(true);
//   };

//   const handleCloseAddPayment = () => {
//     setOpenAddPayment(false);
//     fetchPaymentData(hostelId);
//   }

//   const handlePayAgain = (id) => {
//     setOpenAddPayment(true);
//     let student = studentPaymentData.find(student => student._id === id);
//     setCurrentStudent(student);
//   }

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleChange = (event) => {
//     setQuery(event.target.value);
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       setPage(0); 
//     }
//   };

//   const generalFilter = (row) => {
//     const lowerCaseQuery = query.toLowerCase();
//     return Object.values(row).some((value) => {
//       return value !== undefined && value !== null && value.toString().toLowerCase().includes(lowerCaseQuery);
//     });
//   };
//   const filteredData = studentPaymentData.filter(generalFilter);
//   console.log("filteredData==>",filteredData);

//   return (
//     <>
//       <AddPayment open={openAddPayment} handleClose={handleCloseAddPayment} hostelId={hostelId} currentStudent={currentStudent} />
//       <Container>
//         <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
//           <Typography variant="h4">Student Payments</Typography>
//           <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
//             <TextField
//               name="search"
//               label="Search"
//               value={query}
//               onChange={handleChange}
//               onKeyPress={handleKeyPress}
//               variant="outlined"
//               size="small"
//               placeholder="Type to search by any field"
//             />
//             <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
//               Add New
//             </Button>
//           </Stack>
//         </Stack>

//         <TableStyle>
//           <Box width="100%" sx={{ mt: '10px' }}>
//             <Card>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Student Name</TableCell>
//                       <TableCell>Month</TableCell>

//                       <TableCell>Library Amount</TableCell>
//                       <TableCell>Food Amount</TableCell>
//                       <TableCell>Hostel Rent</TableCell>

//                       <TableCell>Monthly Total Rent</TableCell>


//                       <TableCell>Monthly Paid Amount</TableCell>
//                       <TableCell>Monthly Pending Amount</TableCell>
                      
//                       <TableCell>Status</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                       <TableRow key={row.id}>
//                         <TableCell>
//                           {row.studentName}<br />
//                           {row.studentPhoneNo}
//                         </TableCell>
//                         <TableCell>{row.month}</TableCell>

//                         <TableCell  >{row.libraryAmount}</TableCell>
//                         <TableCell>{row.foodAmount}</TableCell>
//                         <TableCell>{row.hostelRent}</TableCell>

//                         <TableCell  >{row.monthlyTotalAmount}</TableCell>

//                         <TableCell  >{row.paidAmount}</TableCell>
//                         {
//                           row.monthlyPending > 0 ?
//                           (<>
//                           <TableCell sx={{color:"red"}}>{row.monthlyPending}</TableCell>
//                           </>) : 
//                           (<>
//                           <TableCell>{row.monthlyPending}</TableCell>
//                           </>)

//                         }
                    
//                         <TableCell>
//                           <Stack direction="row" alignItems="center">
//                             {row.monthlyPending > 0 ? (
//                               <Typography variant="body2" color="red">
//                                 Pending
//                               </Typography>
//                             ) : (
//                               <Typography variant="body2" color="green">
//                                 Complete
//                               </Typography>
//                             )}
//                           </Stack>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <TablePagination
//                 component="div"
//                 count={paymentRecordsCount}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </Card>
//           </Box>
//         </TableStyle>
//       </Container>
//     </>
//   );
// }
// export default PaymentList;

import {
 Stack, TextField, Button, Container, Typography, Box, Card, Table, TableBody, TableCell as MuiTableCell, TableContainer, TableHead, TableRow as MuiTableRow, TablePagination, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPayment from './AddPayment';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import { width } from '@mui/system';

const HeaderCell = styled(MuiTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200], 
  color: theme.palette.common.black, 
  fontWeight: 'bold', 
  padding: theme.spacing(1),
}));

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`, 
}));

const TableRow = styled(MuiTableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover, 
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PaymentList = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hostelId, setHostelId] = useState();
  const [studentPaymentData, setStudentPaymentData] = useState([]);
  const [paymentRecordsCount, setPaymentRecords] = useState(0);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [query, setQuery] = useState('');

  const [status, setStatus] = useState('All');

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };
  console.log("status==>",status);

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchPaymentData(Hos_Id);
  }, []);

  const fetchPaymentData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/list/${hostelId}`);
      setStudentPaymentData(response.data.result);
      setPaymentRecords(response.data.totalRecodes);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  }

  const handleOpenAdd = () => {
    setOpenAddPayment(true);
  };

  const handleCloseAddPayment = () => {
    setOpenAddPayment(false);
    fetchPaymentData(hostelId);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setPage(0); 
    }
  };

  const generalFilter = (row) => {
    const lowerCaseQuery = query.toLowerCase();
    return Object.values(row).some((value) => {
      return value !== undefined && value !== null && value.toString().toLowerCase().includes(lowerCaseQuery);
    });
  };

  const statusFilter = (row) => {
    if (status === 'All') return true;
    return status === 'Complete' ? row.monthlyPending <= 0 : row.monthlyPending > 0;
  };

  const filteredData = studentPaymentData
                       .filter(generalFilter)
                       .filter(statusFilter);

  

  return (
    <>
      <AddPayment open={openAddPayment} handleClose={handleCloseAddPayment} hostelId={hostelId} currentStudent={currentStudent} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Student Payments</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>

          <FormControl variant="filled" size="small" style={{width :140}}>
          <InputLabel>Filter By Status</InputLabel>
          <Select
            value={status}
            onChange={handleStatusChange}
             defaultValue="All"
             label="Filter By Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
            <TextField
              name="search"
              label="Search"
              value={query}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              placeholder="Type to search by any field"
            />
            <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>

        <Box width="100%" sx={{ mt: '10px' }}>
          <Card sx={{ border: 'none', boxShadow: 'none' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>Student Name</HeaderCell>
                    <HeaderCell>Month</HeaderCell>
                    <HeaderCell>Library Amount</HeaderCell>
                    <HeaderCell>Food Amount</HeaderCell>
                    <HeaderCell>Hostel Rent</HeaderCell>
                    <HeaderCell>Monthly Total Rent</HeaderCell>
                    <HeaderCell>Monthly Paid Amount</HeaderCell>
                    <HeaderCell>Monthly Pending Amount</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {row.studentName}<br />
                        {row.studentPhoneNo}
                      </TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.libraryAmount}</TableCell>
                      <TableCell>{row.foodAmount}</TableCell>
                      <TableCell>{row.hostelRent}</TableCell>
                      <TableCell>{row.monthlyTotalAmount}</TableCell>
                      <TableCell>{row.paidAmount}</TableCell>
                      <TableCell sx={{ color: row.monthlyPending > 0 ? "red" : "inherit" }}>
                        {row.monthlyPending}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          {row.monthlyPending > 0 ? (
                            <Typography variant="body2" color="error">
                              Pending
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="success">
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
              count={paymentRecordsCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default PaymentList;
