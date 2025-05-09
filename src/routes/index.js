import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import SuperAdminRoutes from './SuperAdminRoutes';
import SubAdminRoutes from './SubAdminRoutes';
import BillRoute from './BillRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes,SuperAdminRoutes, SubAdminRoutes, BillRoute]);
}
