import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';
import { Typography } from '@mui/material';

// dashboard routing
// const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const SuperAdminDashboardDefault = Loadable(lazy(() => import('views/SuperAdminDashboard/Default')));
const Administrator = Loadable(lazy(() => import('views/Administrator')));
const ViewAdministrator = Loadable(lazy(() => import('views/Administrator/ViewAdministrator')));
const Hostel = Loadable(lazy(() => import('views/Hostels')));
const ViewHostel = Loadable(lazy(() => import('views/Hostels/ViewHostel')));
const StudentReservation = Loadable(lazy(() => import('views/StudentReservation')));
const ViewReserveStudent = Loadable(lazy(() => import('views/StudentReservation/ViewReserveStudent')));
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

const SuperAdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <SuperAdminDashboardDefault />
    },
    {
      path: 'superadmindashboard',
      children: [
        {
          path: 'default',
          element: <SuperAdminDashboardDefault />
        }
      ]
    },
    {
      path: 'superadmindashboard',
      children: [
        {
          path: 'administrator',
          element: <Administrator />
        },
        {
          path: 'administrator/view/:id',
          element: <ViewAdministrator />
        }
      ]
    },
    {
      path: 'superadmindashboard',
      children: [
        {
          path: 'hostel',
          element: <Hostel />
        },
        {
          path: 'hostel/view/:id',
          element: <ViewHostel />
        }
      ]
    },
  
  ]
};

export default SuperAdminRoutes;
