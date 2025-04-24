import { useState, useEffect } from 'react';
import {Card, Stack, Button, Container,TextField, Typography, Box, Table, TableBody, TableCell as MuiTableCell, TableRow as MuiTableRow, TableContainer, TableHead,  IconButton ,Dialog, DialogTitle, DialogContent, DialogActions,TablePagination,Tab, Tabs } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';
import TableStyle from 'ui-component/TableStyle';
import { styled } from '@mui/material/styles';

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
  // '&:nth-of-type(even)': {
  //   backgroundColor: theme.palette.action.hover, 
  // },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PendingFeeStudent = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [paymentData, setPaymentData] = useState([]);
  const [hostelId, setHostelId] = useState(null);

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchPaymentData(Hos_Id);
  }, []);

  // Fetch All Payment Data Here
  const fetchPaymentData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/list/${hostelId}`);
      setPaymentData(response.data.result);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  }
  console.log("paymentData===>",paymentData);

  return (
    <>
      <Container>
        <TableStyle>
          <Box width="100%" sx={{mt : '10px'}}>
            <Card>
               <Stack direction="row" alignItems="center" justifyContent={'space-between'} padding={2}>
                <Typography variant="h4">Pending Fee List</Typography>
                </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Student Name</HeaderCell>
                      <HeaderCell>Month</HeaderCell>

                      <HeaderCell>Library Amount</HeaderCell>
                      <HeaderCell>Food Amount</HeaderCell>
                      <HeaderCell>Monthly Hostel Rent</HeaderCell>

                      <HeaderCell>Monthly Total Rent</HeaderCell>

                      <HeaderCell>Monthly Paid Amount</HeaderCell>
                      <HeaderCell>Monthly Pending Amount</HeaderCell>

                      <HeaderCell>Action</HeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paymentData.map((row) => (
                      <TableRow key={row.id}>

                        {
                          row.monthlyPending > 0 ? 
                          (<>
                          <TableCell>
                          {row.studentName}<br />
                          {row.studentPhoneNo}
                        </TableCell>
                        <TableCell>{row.month}</TableCell>

                        <TableCell  >{row.libraryAmount}</TableCell>
                        <TableCell>{row.foodAmount}</TableCell>
                        <TableCell>{row.hostelRent}</TableCell>

                        <TableCell  >{row.monthlyTotalAmount}</TableCell>

                        <TableCell  >{row.paidAmount}</TableCell>
                        <TableCell sx={{color:"red"}}>{row.monthlyPending}</TableCell>
                        <TableCell>
                        <Button  variant="contained" color="primary" size="small"
                          style={{ width: '120px', }} 
                        >
                          Send Message
                        </Button>
                        </TableCell>
                          </>) 
                          : 
                          (<></>)
                        }
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
          </TableStyle>
      </Container>

     
    </>
  );
}

export default PendingFeeStudent;