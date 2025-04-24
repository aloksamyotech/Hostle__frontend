import { Container, Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Avatar,IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';

const ViewReserveStudent = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [revStudentData, setRevStudentData] = useState(null);

  const location = useLocation();
  console.log("location=>",location);
  const pathname = location.pathname;

  // Split the pathname by slashes and get the last part
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  console.log("id ==>",id);

  useEffect(()=>{
    const fetchReserveStudentDetails = async() => {
      try{
        console.log("Making API With This URL==>", `${REACT_APP_BACKEND_URL}/sudent_reservation/view/${id}`);
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/view/${id}`,{
          headers : {
            'Authorization': `Bearer ${Cookies.get('Admin_Token')}`,
          }
        });
        console.log("API response=>", response);
        setRevStudentData(response.data.result);
      }catch(error){
        console.error("Error fetching reserved student details:", error);
      }
    }

    fetchReserveStudentDetails();
  },[id]);

  console.log("revStudentData==>",revStudentData);





  return (
    <Container>
   
      <Box mb={1} display="flex" alignItems="center">
        <Link to="/dashboard/student_reservation" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton edge="start" color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h4">
          View all Details of Student
        </Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Student Name</TableCell>
                <TableCell>{revStudentData?.studentName}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Room No</TableCell>
                <TableCell>{revStudentData?.roomNumber}</TableCell>
              </TableRow>

              <TableRow>
              <TableCell component="th" scope="row">CheckIn Date</TableCell>
                <TableCell>{moment(revStudentData?.startDate).format('YYYY-MM-DD')}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">CheckOut Date</TableCell>
                <TableCell>{moment(revStudentData?.endDate).format('YYYY-MM-DD')}</TableCell>
              </TableRow>


              
              <TableRow>
                <TableCell component="th" scope="row">Library Fee</TableCell>
                <TableCell>Rs {revStudentData?.libraryAmount} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Food Fee</TableCell>
                <TableCell>Rs {revStudentData?.foodAmount} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Monthly Hostel Rent</TableCell>
                <TableCell>Rs {revStudentData?.hostelRent} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Total Fee</TableCell>
                <TableCell>Rs {revStudentData?.totalAmount} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Advance Payment</TableCell>
                <TableCell>Rs {revStudentData?.advancePayment} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Deposite Amount</TableCell>
                <TableCell>Rs {revStudentData?.depositAmount} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Monthly Fee Pending</TableCell>
                <TableCell>Rs {revStudentData?.pendingAmount} /-</TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">Deposit Date & Time</TableCell>
                <TableCell>{moment(revStudentData?.paymentDateTime).format('YYYY-MM-DD')}</TableCell>
              </TableRow>


            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};
export default ViewReserveStudent;


