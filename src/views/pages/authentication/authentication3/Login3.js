import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery,Box } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    // <AuthWrapper1>
    //   <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
    //     <Grid item xs={12}>
    //       <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
    //         <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
    //           <AuthCardWrapper>
    //             <Grid container spacing={2} alignItems="center" justifyContent="center">
    //               <Grid item sx={{ mb: 3 }}>
    //                 <Link to="#">
    //                   <Logo />
    //                 </Link>
    //               </Grid>
    //               <Grid item xs={12}>
    //                 <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
    //                   <Grid item>
    //                     <Stack alignItems="center" justifyContent="center" spacing={1}>
    //                       <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
    //                         Hi, Welcome Back
    //                       </Typography>
    //                       <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
    //                         Enter your credentials to continue
    //                       </Typography>
    //                     </Stack>
    //                   </Grid>
    //                 </Grid>
    //               </Grid>
    //               <Grid item xs={12}>
    //                 <AuthLogin />
    //               </Grid>
    //             </Grid>
    //           </AuthCardWrapper>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //     <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
    //       <AuthFooter />
    //     </Grid>
    //   </Grid>
    // </AuthWrapper1>

    <AuthWrapper1>
      <Grid container sx={{ minHeight: '100vh', backgroundColor: '#441572' }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AuthCardWrapper
            sx={{
              maxWidth: 400,
              width: '100%',
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item sx={{ mb: 2, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2px',
                    marginLeft: 12
                  }}
                >
                  <Logo />
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ marginTop: '-20px' }}>
                <Stack alignItems="center">
                  <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: '#240046' }}>
                    Welcome to HMS
                  </Typography>
                  <Typography textAlign="center" variant="body2" sx={{ color: 'black' }}>
                    Login to use the platform
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ backgroundColor: '#ffffff' }} />
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2f124c',
              padding: '4px',
              flexDirection: 'column'
            }}
          >
            <Box
              component="img"
              src={''}
              alt="Inventory Management"
              sx={{
                maxWidth: '60%',
                maxHeight: '60%',
                objectFit: 'contain',
                borderRadius: '20px'
              }}
            />
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '16px'
              }}
            >
              Hostel Management System <br />
              <span style={{ fontSize: '12px' }}>Simplify room allocations, manage reservations, and track hostel operations seamlessly.</span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
