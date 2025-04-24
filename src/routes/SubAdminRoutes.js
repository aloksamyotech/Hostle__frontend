import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';
import { Typography } from '@mui/material';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Administrator = Loadable(lazy(() => import('views/Administrator')));
const ViewAdministrator = Loadable(lazy(() => import('views/Administrator/ViewAdministrator')));
const Student = Loadable(lazy(() => import('views/Student')));
const ViewStudent = Loadable(lazy(() => import('views/Student/ViewStudent')));
const Complaints = Loadable(lazy(() => import('views/Complaints')));
const Hostel = Loadable(lazy(() => import('views/Hostels')));
const ViewHostel = Loadable(lazy(() => import('views/Hostels/ViewHostel')));
const StudentReservation = Loadable(lazy(() => import('views/StudentReservation')));
const ViewReserveStudent = Loadable(lazy(() => import('views/StudentReservation/ViewReserveStudent')));
const ProfileDetails = Loadable(lazy(() => import('views/StudentReservation/ProfileDetails')));

const Visitors = Loadable(lazy(() => import('views/Visitor')));
const Room = Loadable(lazy(() => import('views/Room')));
const ViewRoom = Loadable(lazy(() => import('views/Room/ViewRoom')));
const EmailTemplates = Loadable(lazy(() => import('views/EmailTemplates')));
const CanteenInventory = Loadable(lazy(() => import('views/CanteenInventory')));
const Calender = Loadable(lazy(() => import('views/Calender')));
const AddTemplates = Loadable(lazy(() => import('views/EmailTemplates/AddTemplates')));
const Attendence = Loadable(lazy(() => import('views/Attendence')));
const InventoryPurches = Loadable(lazy(() => import('views/InventoryPurches')));
const InventoryConsumption = Loadable(lazy(() => import('views/InventoryConsumption')));
const Expenditure = Loadable(lazy(() => import('views/Expenditure')));
const Payment = Loadable(lazy(() => import('views/Payment')));
const NoticeBoard = Loadable(lazy(() => import('views/NoticeBoard')));
const WeeklyFoodMenu = Loadable(lazy(() => import('views/WeeklyFoodMenu')));

// ==============================|| MAIN ROUTING ||============================== //

const SubAdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'student',
          element: <Student/>
        },{
          path: 'student/view/:id',
          element: <ViewStudent/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'complaints',
          element: <Complaints/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'room',
          element: <Room />
        },{
          path: 'room/view/:id',
          element: <ViewRoom/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'visitor',
          element: <Visitors/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'student_reservation',
          element: <StudentReservation />
        },{
          path: 'student_reservation/view/:id',
          element: <ViewReserveStudent/>
        },{
          path: 'student_reservation/view_profile/:id',
          element: <ProfileDetails/>

        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'canteen_inventory',
          element: <CanteenInventory/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'purches_inventory',
          element: <InventoryPurches/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'consume_inventory',
          element: <InventoryConsumption/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'expenditures',
          element: <Expenditure/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'notice_board',
          element: <NoticeBoard/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'weekly_foodmenu',
          element: <WeeklyFoodMenu/>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'payments',
          element: <Payment/>
        }
      ]
    }
  ]
};

export default SubAdminRoutes;
