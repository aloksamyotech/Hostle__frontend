import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRoutes, Routes, Route } from 'react-router-dom';

// routing
import Login from 'views/pages/authentication/authentication3/Login3';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import SubAdminRoutes from 'routes/SubAdminRoutes';
import SuperAdminRoutes from 'routes/SuperAdminRoutes';
import BillRoute from 'routes/BillRoutes';

import MainLayout from 'layout/MainLayout';

// ==============================|| APP ||============================== //

const AppRoutes = ({ role }) => {
  let routes;
  console.log('role in app.js =>', role);

  if (role === 'Customer') {
    // routes = SubAdminRoutes.children;
    routes = [...SubAdminRoutes.children, ...BillRoute.children];
    console.log("this is customer ==>", routes);
    
  } else if (role === 'SuperAdmin') {
    routes = SuperAdminRoutes.children;
  } else {
    routes = [{ path: '*', element: <Login /> }];
  }

  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: routes
    }
  ]);

  return element;
};

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [isTokenExpired, setIsTokenExpired] = useState(true);
  const [role, setRole] = useState('');
  const [token, setToken] = useState(true);

  useEffect(() => {
    const token = Cookies.get('Token');
    const userRole = Cookies.get('Role');
    setRole(userRole);

    const checkToken = () => {
      if (token) {
        setToken(false);
      } else {
        setToken(true);
      }
    };
    checkToken();
  }, [token, role]);

  console.log('token found in app.js =>', token, 'role ==>', role);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        <NavigationScroll>
          {token ? (
            <Routes>
              <Route path="/*" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          ) : (
            <AppRoutes role={role} />
          )}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
export default App;
