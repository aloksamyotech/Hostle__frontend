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
  const [totalRooms, setTotalRooms] = useState(0);
  const [avaBedsCount, setAvaBedsCount] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [hostelId, setHostelId] = useState(null);

  const navigate = useNavigate();

  //Fetch Dashboard Data----------------
  async function fetchDashboardData(hostelId) {
    try {
      const resForStudent = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);

      setStudentCount(resForStudent.data.total_recodes);

      const resForTotalRooms = await axios.get(`${REACT_APP_BACKEND_URL}/room/index/${hostelId}`);

      setTotalRooms(resForTotalRooms.data.totalRecodes);
      setAvaRoomsCount(resForTotalRooms.data.availableRoomCount);
      setAvaBedsCount(resForTotalRooms.data.totalAvailableBeds);

      const responseForExpense = await axios.get(`${REACT_APP_BACKEND_URL}/expense/allexpenses/${hostelId}`);

      const expensesData = responseForExpense.data.monthlyExpenses;

      // Transform the data to the required format for the chart
      const transformedData = Object.keys(expensesData).map((month) => ({
        label: month,
        value: expensesData[month]
      }));
      setMonthlyExpenses(transformedData);

      const resForAllComplaints = await axios.get(`${REACT_APP_BACKEND_URL}/student_complaint/allComplaints/${hostelId}`);

      const complaintData = resForAllComplaints.data.totalComplaints;

      const transformedComplaintsData = Object.keys(complaintData).map((complaint) => ({
        label: complaint,
        value: complaintData[complaint]
      }));

      setAllComplaints(transformedComplaintsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchDashboardData(HosId);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid
            item
            lg={3}
            md={6}
            sm={6}
            xs={12}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/dashboard/room');
            }}
          >
            <TotalRoomsCountCard isLoading={isLoading} totalRoomsCount={totalRooms} />
          </Grid>

          <Grid
            item
            lg={3}
            md={6}
            sm={6}
            xs={12}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/dashboard/student_reservation');
            }}
          >
            <TotalStudentCountCard isLoading={isLoading} totalStudentCount={studentCount} />
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            md={6}
            lg={3}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/dashboard/room');
            }}
          >
            <RoomsCountCard isLoading={isLoading} availableRoomsCount={avaRoomsCount} />
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            md={6}
            lg={3}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/dashboard/room');
            }}
          >
            <TotalAvailableBedsCount isLoading={isLoading} availableBedsCount={avaBedsCount} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <PendingFeeStudent />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
