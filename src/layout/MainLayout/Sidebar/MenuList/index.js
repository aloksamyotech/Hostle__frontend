// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import Cookies from 'js-cookie';

// ==============================|| SIDEBAR MENU LIST ||============================== //
const MenuList = () => {
  const user = Cookies.get('Role');
  console.log("user==>",user);

  const subAdminItems = menuItem.subAdmin.map((item) => {
    switch (item.type) {
      case 'Customer':
        // return <NavGroup key={item.id} item={item} />;
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Sub Admin Menu Item Error
          </Typography>
        );
    }
  });

  const superAdminItems = menuItem.superAdmin.map((item) => {
    switch (item.type) {
      case 'SuperAdmin':
        // return <NavGroup key={item.id} item={item} />;
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Super Admin Menu Item Error
          </Typography>
        );
    }
  });

  

  return<>
  {user === 'Customer' && subAdminItems}
  {user === 'SuperAdmin' && superAdminItems}
  </>;
};

export default MenuList;
