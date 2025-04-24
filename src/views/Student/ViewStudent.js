import { Container, Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Avatar,IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Cookies from 'js-cookie';

const ViewStudent = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [studentDetails, setStudentDetails ] = useState(null);

  const location = useLocation();
  console.log("location=>",location);
  const pathname = location.pathname;

  // Split the pathname by slashes and get the last part
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  console.log("id=====>",id);

  //Fetch Student Data Here 
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        console.log("Making API With This URL==>", `${REACT_APP_BACKEND_URL}/student/view/${id}`);
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/student/view/${id}`,{
          headers : {
            'Authorization': `Bearer ${Cookies.get('Admin_Token')}`,
          }
        });
        console.log("API response:", response);
        setStudentDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudentDetails();
  }, [REACT_APP_BACKEND_URL, id]);
  console.log("studentDetails==>",studentDetails);

  //Date Format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <Container>
      <Box mb={1} display="flex" alignItems="center">
        <Link to="/dashboard/student" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton edge="start" color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h4" >
          View All Details of Student
        </Typography>
      </Box>

      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {studentDetails?.photo && (
              <Box display="flex" justifyContent="center" alignItems="center" height="50%">
                <img
                  src={`${REACT_APP_BACKEND_URL}/uploads/Profiles/${studentDetails.photo}`}
                  alt="AdminProfilePhoto"
                  style={{ width: 150, height: 150 }}
                />
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <TableContainer sx={{mt:3,mb:3}}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Student Hostel Id</TableCell>
                    <TableCell>{studentDetails?.studentHosId}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Hostel Name</TableCell>
                    <TableCell>{studentDetails?.hostelname}</TableCell>
                  </TableRow>



                  <TableRow>
                    <TableCell component="th" scope="row">Student Name</TableCell>
                    <TableCell>{studentDetails?.firstname} {studentDetails?.lastname}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Email Id</TableCell>
                    <TableCell>{studentDetails?.email}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Phone No</TableCell>
                    <TableCell>{studentDetails?.phonenumber}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">AadharCard Id</TableCell>
                    <TableCell>{studentDetails?.aadharcardId}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Date Of Birth</TableCell>
                    <TableCell>{studentDetails?.dateOfBirth ? formatDate(studentDetails.dateOfBirth) : 'N/A'}</TableCell>
                  
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Address</TableCell>
                    <TableCell>{studentDetails?.address}, {studentDetails?.city}, {studentDetails?.state} </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
export default ViewStudent;


