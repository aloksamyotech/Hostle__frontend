import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import TotalStudentCountCard from './TotalStudentCountCard';
import PopularCard from './PopularCard';
import TotalAvailableBedsCount from './TotalAvailableBedsCount';
import RoomsCountCard from './RoomsCountCard';
import TotalRoomsCountCard from './TotalRoomsCountCard';

import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import AppTrafficBySite from './TrafficBySiteCard';
import Iconify from '../../../ui-component/iconify';
import AppTasks from './AppTask';

import MonthlyExpenses from './MonthlyExpenses';
import AllComplaints from './AllComplaints';

import PendingFeeStudent from './PendingFeeStudentTable';
import { useNavigate } from 'react-router';

// ==============================|| SUBADMIN DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [avaRoomsCount, setAvaRoomsCount] = useState(0);
  const [totalRooms,setTotalRooms] = useState(0);
  const [avaBedsCount, setAvaBedsCount] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [hostelId, setHostelId] = useState(null);

  const navigate = useNavigate();


  //Fetch Dashboard Data----------------
    async function fetchDashboardData(hostelId){
      try{
        console.log("URL=>",`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
        const resForStudent = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
        console.log("hyyyyyyyyyyyyyy response for resForStudent ========>",resForStudent);
        setStudentCount(resForStudent.data.total_recodes);

        console.log("URL=>",`${REACT_APP_BACKEND_URL}/room/index/${hostelId}`);
        const resForTotalRooms = await axios.get(`${REACT_APP_BACKEND_URL}/room/index/${hostelId}`);
        console.log("response for resForTotalRooms -------========>",resForTotalRooms);
        setTotalRooms(resForTotalRooms.data.totalRecodes);
        setAvaRoomsCount(resForTotalRooms.data.availableRoomCount);
        setAvaBedsCount(resForTotalRooms.data.totalAvailableBeds);
        
        console.log("URL =>",`${REACT_APP_BACKEND_URL}/expense/allexpenses/${hostelId}`);
        const responseForExpense = await axios.get(`${REACT_APP_BACKEND_URL}/expense/allexpenses/${hostelId}`);
        console.log("response For Expense =======>",responseForExpense);

        const expensesData = responseForExpense.data.monthlyExpenses;
        console.log("expensesData==>", expensesData);

        // Transform the data to the required format for the chart
        const transformedData = Object.keys(expensesData).map(month => ({
          label: month,
          value: expensesData[month]
        }));
        setMonthlyExpenses(transformedData);
        console.log("transformedData==>", transformedData);


        console.log("URL =>",`${REACT_APP_BACKEND_URL}/student_complaint/allComplaints/${hostelId}`);
        const resForAllComplaints = await axios.get(`${REACT_APP_BACKEND_URL}/student_complaint/allComplaints/${hostelId}`);
        console.log("response for resForAllComplaints =======>",resForAllComplaints);

        const complaintData = resForAllComplaints.data. totalComplaints;
        console.log("complaintData==>",complaintData);

        const transformedComplaintsData = Object.keys(complaintData).map(complaint => ({
          label : complaint,
          value : complaintData[complaint]
        }));

        setAllComplaints(transformedComplaintsData);
        console.log("transformedComplaintsData==>",transformedComplaintsData);

      }catch(error){
        console.error('Failed to fetch data:', error);
      }finally{
        setLoading(false);
      }

    }
 

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(()=>{
    const HosId = Cookies.get('_Id');		
      if(HosId){
        setHostelId(HosId);
      }
      fetchDashboardData(HosId);
  },[]);

  
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>

          <Grid item lg={3} md={6} sm={6} xs={12} 
          sx={{ cursor: 'pointer' }} 
          onClick={()=>{
            navigate('/dashboard/room')
          }}>
            <TotalRoomsCountCard isLoading={isLoading} totalRoomsCount={totalRooms}/>
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}
          sx={{ cursor: 'pointer' }} 
          onClick={()=>{
            navigate('/dashboard/student_reservation')
          }}>
            <TotalStudentCountCard isLoading={isLoading} totalStudentCount={studentCount} />
          </Grid>

          <Grid item sm={6} xs={12} md={6} lg={3}
          sx={{ cursor: 'pointer' }} 
          onClick={()=>{
            navigate('/dashboard/room')
          }}>
            <RoomsCountCard isLoading={isLoading} availableRoomsCount={avaRoomsCount}/>
          </Grid>

          <Grid item sm={6} xs={12} md={6} lg={3}
          sx={{ cursor: 'pointer' }} 
          onClick={()=>{
            navigate('/dashboard/room')
          }}>
            <TotalAvailableBedsCount isLoading={isLoading} availableBedsCount={avaBedsCount}/>
          </Grid>

        </Grid>
      </Grid>

      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={6} >
            <MonthlyExpenses
              title="Monthly Expense's"
              subheader="All Monthly Expenditures"
              chartData={ monthlyExpenses }
            />
          </Grid>
          <Grid item xs={12} md={4} lg={6}>
            <AllComplaints
              title="Current Complaint's Status"
              chartData={allComplaints}
              chartColors={[theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.error.main]}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <PendingFeeStudent/>
      </Grid>

      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={5}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />
                }
              ]}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' }
              ]}
            />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
