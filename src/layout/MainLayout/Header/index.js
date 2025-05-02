import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import Cookies from 'js-cookie';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  const user = JSON.parse(Cookies.get('user'));
  console.log('HosIdHosIdHosIdHosIdHosIdHosIdHosId :', user);

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {user.role === 'Customer' ? (
        <Typography variant="h3" sx={{ mx: 2, color: '#2C69D1' }}>
          {' '}
          Welcome to {user?.hostelName} !
        </Typography>
      ) : (
        <Typography variant="h3" sx={{ mx: 2, color: '#2C69D1' }}>
          {' '}
          Welcome {user?.name} !
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'grey.600' }}>
          Today is {new Date().toLocaleDateString('en-US', { weekday: 'long' })}, {new Date().toLocaleDateString('en-GB')}
        </Typography>
      </Box>

      {/* <Box sx={{ flexGrow: 1 }} /> */}
      {/* <Box sx={{ flexGrow: 1 }} /> */}

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
