import { Container, Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Avatar,IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const ViewAdministrator = () => {

  const [adminDetail, setAdminDetails ] = useState(null);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const location = useLocation();
  console.log("location=>",location);
  const pathname = location.pathname;

  // Split the pathname by slashes and get the last part
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  console.log("id=====>",id);

  //Get Admin Data Here
  useEffect(()=>{
    const fetchAdminDetails = async ()=> {
      console.log("in fetchAdminDetails");
      try{
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/administrator/view/${id}`);
        console.log("Response=>",response);
        setAdminDetails(response.data.user);
      }catch(error){
        console.log("Error Found : ", error);
      }
    }
    fetchAdminDetails();
  },[id]);
  console.log("adminDetail===>",adminDetail);

  return (
    <Container>
      <Box mb={1} display="flex" alignItems="center">
        <Link to="/dashboard/administrator" style={{ textDecoration: 'none', color: 'inherit' }}> 
          <IconButton edge="start" color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h4">
          View Details of Hostel Admin
        </Typography>
      </Box>

      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {adminDetail?.photo && (
              <Box display="flex" justifyContent="center" alignItems="center" height="50%">
                <img
                  src={`${REACT_APP_BACKEND_URL}/uploads/Profiles/${adminDetail.photo}`}
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
                    <TableCell component="th" scope="row">Hostel Name</TableCell>
                    <TableCell>{adminDetail?.hostelname}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Name</TableCell>
                    <TableCell>{adminDetail?.firstname} {adminDetail?.lastname}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Email Id</TableCell>
                    <TableCell>{adminDetail?.email}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Phone No</TableCell>
                    <TableCell>{adminDetail?.phonenumber}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Gender</TableCell>
                    <TableCell>{adminDetail?.gender}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">AadharCard Id</TableCell>
                    <TableCell>{adminDetail?.aadharcardId}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">Address</TableCell>
                    <TableCell>{adminDetail?.address}, {adminDetail?.city}, {adminDetail?.state} </TableCell>
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
export default ViewAdministrator;


