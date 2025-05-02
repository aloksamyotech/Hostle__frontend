// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router';
// import { useTheme } from '@mui/material/styles';
// import {
//   Box,
//   Button,
//   Checkbox,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   Grid,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput,
//   Stack,
//   Typography,
//   useMediaQuery
// } from '@mui/material';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import useScriptRef from 'hooks/useScriptRef';
// import AnimateButton from 'ui-component/extended/AnimateButton';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import Google from 'assets/images/icons/social-google.svg';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const FirebaseLogin = ({ ...others }) => {
//   const theme = useTheme();
//   const scriptedRef = useScriptRef();
//   const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
//   const customization = useSelector((state) => state.customization);
//   const [checked, setChecked] = useState(true);

//   const googleHandler = async () => {
//     console.error('Login');
//   };

//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const navigate = useNavigate();
//   const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

//   const loginApi = async (email, password) => {
//     try {
//       const response = await axios.post(`${REACT_APP_BACKEND_URL}/administrator/login`, {
//         email,
//         password
//       });
//       console.log('Login response====>', response);
//       return response.data;
//     } catch (error) {
//       throw error.response ? error.response.data : new Error('Network Error');
//     }
//   };

//   return (
//     <>
//       <Formik
//         initialValues={{
//           email: '',
//           password: '',
//           submit: null
//         }}
//         validationSchema={Yup.object().shape({
//           email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//           password: Yup.string().max(255).required('Password is required')
//         })}
//         onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//           console.log('values=>', values);
//           try {
//             const response = await loginApi(values.email, values.password);
//             setStatus({ success: true });
//             setSubmitting(false);
//             console.log('Login response hhhhhhhhhhhhhhhhhhhhh===>', response);
//             console.log('response.token==>', response.token);

//             if (response.token) {
//               Cookies.set('Token', response.token, { expires: 7 });
//               Cookies.set('_Id', response.user._id);
//               Cookies.set('Role', response.user.role);
//               Cookies.set('user',  JSON.stringify(response.user));

//               if (response.user.role === 'Customer') {
//                 navigate('/dashboard/default');
//                 window.location.reload();
//               } else {
//                 navigate('/superadmindashboard/default');
//                 window.location.reload();
//               }
//             }
//           } catch (error) {
//             console.error('Login Error:', error);
//             setStatus({ success: false });
//             setErrors({ submit: error.message });
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//           <form noValidate onSubmit={handleSubmit} {...others}>
//             <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
//               <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-email-login"
//                 type="email"
//                 value={values.email}
//                 name="email"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 label="Email Address / Username"
//                 inputProps={{}}
//               />
//               {touched.email && errors.email && (
//                 <FormHelperText error id="standard-weight-helper-text-email-login">
//                   {errors.email}
//                 </FormHelperText>
//               )}
//             </FormControl>

//             <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
//               <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password-login"
//                 type={showPassword ? 'text' : 'password'}
//                 value={values.password}
//                 name="password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                       size="large"
//                     >
//                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 label="Password"
//                 inputProps={{}}
//               />
//               {touched.password && errors.password && (
//                 <FormHelperText error id="standard-weight-helper-text-password-login">
//                   {errors.password}
//                 </FormHelperText>
//               )}
//             </FormControl>
//             {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
//               <FormControlLabel
//                 control={
//                   <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
//                 }
//                 label="Remember me"
//               />
//               <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
//                 Forgot Password?
//               </Typography>
//             </Stack> */}
//             {errors.submit && (
//               <Box sx={{ mt: 3 }}>
//                 <FormHelperText error>{errors.submit}</FormHelperText>
//               </Box>
//             )}

//             <Box sx={{ mt: 2 }}>
//               <AnimateButton>
//                 <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
//                   Sign in
//                 </Button>
//               </AnimateButton>
//             </Box>
//           </form>
//         )}
//       </Formik>
//     </>
//   );
// };

// export default FirebaseLogin;

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Divider,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef.js';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import { filterMenuItems, dashboard } from '../../../../menu-items/dashboard.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import Cookies from 'js-cookie';

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scriptedRef = useScriptRef();
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCredentialClick = async (email, password, setFieldValue, handleSubmit) => {
    setFieldValue('email', email);
    setFieldValue('password', password);

    setTimeout(() => {
      handleSubmit();
    }, 500);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus }) => {
          try {
            setIsSubmitting(true);
            console.log('login values :', values);
            const response = await axios.post(`${REACT_APP_BACKEND_URL}/administrator/login`, values);
            console.log('this is login response :: ========>', response);

            if (response?.data?.token) {
              Cookies.set('Token', response?.data?.token, { expires: 7 });
              Cookies.set('_Id', response?.data?.user._id);
              Cookies.set('Role', response?.data?.user.role);
              Cookies.set('user', JSON.stringify(response?.data?.user));

              if (response?.data?.user?.role === 'Customer') {
                navigate('/dashboard/default');
                window.location.reload();
              } else {
                navigate('/superadmindashboard/default');
                window.location.reload();
              }
            }
          } catch (error) {
            toast.error(error.message || 'Login failed');
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{
                '& .MuiFormLabel-root': {
                  color: '#000066'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errors.email ? '#000066' : ''
                  }
                },
                mb: 2
              }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
              />
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </FormControl>
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{
                '& .MuiFormLabel-root': {
                  color: '#000066'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errors.email ? '#000066' : ''
                  }
                }
              }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>

            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick('admin@gmail.com', 'admin@123', setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">Admin Credentials</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick('gk@gmail.com', 'Gk123456', setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">User Credentials</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    background: 'linear-gradient(45deg, #441572, #7c4bad)',
                    borderRadius: '50px',
                    '&:hover': {
                      background: 'linear-gradient(to right, #4b6cb7, #182848)',
                      boxShadow: '2'
                    }
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Sign in'}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
