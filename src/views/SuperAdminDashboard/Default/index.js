import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gridSpacing } from 'store/constant';

//-----------------------------------------------------

import TotalRooms from './TotalRooms';
import TotalStudents from './TotalStudents';
import TotalHostels from './TotalHostels';
import TotalAdmin from './TotalAdmins';
import RoomsUpdate from './RoomsUpdate';



// ==============================|| SUPER ADMIN DEFAULT DASHBOARD ||============================== //

const SuperAdminDashboard = () =>{
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  
    const theme = useTheme();
    const [isLoading, setLoading] = useState(true);
    const [adminId, setAdminId] = useState(null);
    const [hostelData, setHostelData] = useState(0);
    const [adminData, setAdminData] = useState(0);
    const [studentData, setStudnetData] = useState(0);
    const [roomData, setRoomData] = useState(0);

    const [hostelsData, setHostelsData] = useState([]);
    const [hostelName, setHostelName ] = useState([]); 

    //Fetch Super Admin Dashboard Data Here-------------
    async function fetchDashboardData(){
      try{
        console.log("in fetchDashboardData---");

        console.log("URL=>",`${REACT_APP_BACKEND_URL}/hostel/list`);
        const resForHostel = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/list`);
        console.log("response for resForStudent ==========>",resForHostel);
        setHostelData(resForHostel.data.totalRecodes);
        
        console.log("URL=>",`${REACT_APP_BACKEND_URL}/administrator/list`);
        const responseForAdmin = await axios.get(`${REACT_APP_BACKEND_URL}/administrator/list`);
        console.log("response for responseForAdmin =========>",responseForAdmin);
        setAdminData(responseForAdmin.data.totalRecodes);

        console.log("URL=>",`${REACT_APP_BACKEND_URL}/student/allStudentCount`);
        const responseForStudent = await axios.get(`${REACT_APP_BACKEND_URL}/student/allStudentCount`);
        console.log("response for responseForStudent =========>",responseForStudent);
        setStudnetData(responseForStudent.data.totalCount);

        console.log("URL=>",`${REACT_APP_BACKEND_URL}/room/alRooms`);
        const responseForRoom = await axios.get(`${REACT_APP_BACKEND_URL}/room/alRooms`);
        console.log("response for responseForRoom =========>",responseForRoom);
        setRoomData(responseForRoom.data.roomRecords);

        console.log("URL=>",`${REACT_APP_BACKEND_URL}/room/calculate-beds`);
        const responseForHostelBeds = await axios.get(`${REACT_APP_BACKEND_URL}/room/calculate-beds`);
        console.log("response for responseForHostelBeds =========>",responseForHostelBeds);
      


        const hostelNames = responseForHostelBeds.data.hostelNames;

        console.log("hostelNames==>",hostelNames);
        
        const hostelsData = responseForHostelBeds.data.hostelsData;

        console.log("hostelsData==>",hostelsData);
        


        const combinedData = hostelsData.map((hostelData, index) => ({
          ...hostelData,
          HostelName: hostelNames[index] 
      }));

      console.log("combinedData==>",combinedData);

      setHostelsData(combinedData);

       

       
       
      }catch(error){
        console.error('Failed to fetch data:', error);
      }finally{
        setLoading(false);
      }

    }

    


    // useEffect(() => {
    //     setLoading(false);
    // }, []);

    //Get Super Admin Obj Id Which is Seted In Cookies
    useEffect(()=>{
      // const AdminId = Cookies.get('_Id');		
      //   if(AdminId){
      //     setAdminId(AdminId);
      //   }
        fetchDashboardData();
    },[]);

    return (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
    
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <TotalHostels isLoading={isLoading} hostelData={hostelData} />
              </Grid>
    
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <TotalAdmin isLoading={isLoading} adminData={adminData}/>
              </Grid>
    
              <Grid item sm={6} xs={12} md={6} lg={3}>
                <TotalStudents isLoading={isLoading} studentData={studentData}/>
              </Grid>
    
              <Grid item sm={6} xs={12} md={6} lg={3}>
                <TotalRooms isLoading={isLoading} roomData={roomData}/>
              </Grid>
    
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
            {hostelsData.map((hostelData) => (
                <Grid item xs={12} md={4} key={hostelData.HostelId}>
                    <RoomsUpdate
                        title={`${hostelData.HostelName}`}
                        chartData={[
                            { label: 'Total Beds', value: hostelData.TotalBeds },
                            { label: 'Occupied Beds', value: hostelData.TotalOccupiedBeds },
                            { label: 'Available Beds', value: hostelData.TotalAvailableBeds }
                        ]}
                        chartColors={[theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main]}
                    />
                </Grid>
            ))}
              

              
              {/* <Grid item xs={12} md={4} lg={4}>
                <RoomsUpdate
                  title="All Hostel Room Updates"
                  chartData={[
                    { label: 'America', value: 4344 },
                    { label: 'Asia', value: 5435 },
                    { label: 'Europe', value: 1443 },
                    { label: 'Africa', value: 4443 }
                  ]}
                  chartColors={[theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main]}
                />
              </Grid> */}
            </Grid>
          </Grid>

{/* <Grid container spacing={3}>
            {hostelsData.map((hostelData) => (
                <Grid item xs={12} md={4} key={hostelData.HostelId}>
                    <RoomsUpdate
                        title={`Pie Chart for Hostel ${hostelData.HostelId}`}
                        chartData={[
                            { label: 'Occupied Beds', value: hostelData.TotalOccupiedBeds },
                            { label: 'Available Beds', value: hostelData.TotalAvailableBeds }
                        ]}
                        chartColors={[theme.palette.primary.main, theme.palette.secondary.main]}
                    />
                </Grid>
            ))}
        </Grid> */}


        </Grid>
      );
}

export default SuperAdminDashboard;