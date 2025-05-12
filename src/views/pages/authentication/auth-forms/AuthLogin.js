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
            toast.error('Login Failed');
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
                {/* <Typography variant="h5">Admin Credentials</Typography> */}
              </Box>
              {/* <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  p: 2
                }}
                onClick={() => handleCredentialClick(setFieldValue, handleSubmit)}
              >
                <Typography variant="h5">User Credentials</Typography>
              </Box> */}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="secondary">
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
