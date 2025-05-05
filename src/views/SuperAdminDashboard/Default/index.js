import { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, Card, Container, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gridSpacing } from 'store/constant';
import TotalRooms from './TotalRooms';
import TotalStudents from './TotalStudents';
import TotalHostels from './TotalHostels';
import TotalAdmin from './TotalAdmins';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from 'ui-component/TableStyle';
import Iconify from 'ui-component/iconify';
import { useNavigate } from 'react-router-dom';
import AddHostel from 'views/Hostels/AddHostel';

// ==============================|| SUPER ADMIN DEFAULT DASHBOARD ||============================== //

const SuperAdminDashboard = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [hostelData, setHostelData] = useState(0);
  const [adminData, setAdminData] = useState(0);
  const [studentData, setStudnetData] = useState(0);
  const [roomData, setRoomData] = useState(0);
  const [hosteldata, setHosteldata] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  async function fetchDashboardData() {
    try {
      const resForHostel = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/list`);
      setHostelData(resForHostel.data.totalRecodes);

      const responseForAdmin = await axios.get(`${REACT_APP_BACKEND_URL}/administrator/list`);
      setAdminData(responseForAdmin.data.totalRecodes);

      const responseForStudent = await axios.get(`${REACT_APP_BACKEND_URL}/student/allStudentCount`);
      setStudnetData(responseForStudent.data.totalCount);

      const responseForRoom = await axios.get(`${REACT_APP_BACKEND_URL}/room/alRooms`);
      setRoomData(responseForRoom.data.roomRecords);

      const response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/list`);
      console.log('response==>', response);
      setHosteldata(response.data.result);

      const responseForHostelBeds = await axios.get(`${REACT_APP_BACKEND_URL}/room/calculate-beds`);
      const hostelNames = responseForHostelBeds.data.hostelNames;
      const hostelsData = responseForHostelBeds.data.hostelsData;

      const combinedData = hostelsData.map((hostelData, index) => ({
        ...hostelData,
        HostelName: hostelNames[index]
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, [openAdd]);

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
      field: 'hostelName',
      headerName: 'Hostel Name',
      flex: 1.5,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box onClick={() => handleNavigate(params.row._id)} sx={{ cursor: 'pointer' }}>
            <Typography variant="body1" fontWeight="bold">
              {params.row.hostelName}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'hostelPhoneNumber',
      headerName: 'Hostel ContactNo.',
      flex: 1.5
    },
    {
      field: 'email',
      headerName: 'Email Id',
      flex: 1.5
    },
    {
      field: 'ownerName',
      headerName: 'Owner Name',
      flex: 1.5,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {params.row.ownerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.ownerPhoneNumber}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2
    }
  ];

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleNavigate = (_id) => {
    navigate(`/superadmindashboard/hostel/view/${_id}`);
  };

  return (
    <>
      <AddHostel open={openAdd} handleClose={handleCloseAdd} />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalHostels isLoading={isLoading} hostelData={hostelData} />
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalAdmin isLoading={isLoading} adminData={adminData} />
            </Grid>

            <Grid item sm={6} xs={12} md={6} lg={3}>
              <TotalStudents isLoading={isLoading} studentData={studentData} />
            </Grid>

            <Grid item sm={6} xs={12} md={6} lg={3}>
              <TotalRooms isLoading={isLoading} roomData={roomData} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Container>
            <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
              <Typography variant="h3">Hostel List</Typography>
              <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                  Add Hostel
                </Button>
              </Stack>
            </Stack>
            <TableStyle>
              <Box width="100%">
                <Card style={{ height: '500px', paddingTop: '15px' }}>
                  {hosteldata && (
                    <DataGrid
                      rows={hosteldata}
                      columns={columns}
                      getRowId={(row) => row?._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{ toolbar: { showQuickFilter: true } }}
                    />
                  )}
                </Card>
              </Box>
            </TableStyle>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default SuperAdminDashboard;
