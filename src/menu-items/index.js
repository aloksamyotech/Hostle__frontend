import dashboard from './dashboard';
import subAdminDashboard from './customerDashboard';
import superAdminDashboard from './superAdminDashboard';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  // items: [dashboard]
  subAdmin : [subAdminDashboard],
  superAdmin : [superAdminDashboard]
};

export default menuItems;
