import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Rating,
  Select,
  TextField,
  Box,
  IconButton
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Palette from 'ui-component/ThemePalette';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const ChangePassword = (props) => {
  const { open, handleClose } = props;
  const user = JSON.parse(Cookies.get('user'));
  console.log('chnage password ... ==>>', user);
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const validationSchema = yup.object({
    email: yup.string().email().required('Email is required'),
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup.string().required('New Password is required'),
    confirmPassword: yup.string().required('Confirm Password is required')
  });

  // Initial values
  const initialValues = {
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      console.log('values of chnage password .... :::', values);

      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/hostel/change_password`, values);
        console.log('change password response ===>', response);

        if (response.status === 200) {
          toast.success('Password updated successfully');
          handleClose();
        }
      } catch (error) {
        console.log('Error :', error);
        toast.error('something went wrong !!');
      } finally {
        setLoading(false);
        handleClose();
        formik.resetForm();
      }
    }
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              textAlign: 'center',
              flexGrow: 1
            }}
          >
            Change Password
          </Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                {/* Form Fields */}
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Email Id</FormLabel>
                  <TextField
                    id="email"
                    name="email"
                    size="small"
                    fullWidth
                    disabled
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Current Password</FormLabel>
                  <TextField
                    id="currentPassword"
                    name="currentPassword"
                    size="small"
                    fullWidth
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>New Password</FormLabel>
                  <TextField
                    id="newPassword"
                    name="newPassword"
                    size="small"
                    fullWidth
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Confirm Password</FormLabel>
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    size="small"
                    fullWidth
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button disabled={loading} onClick={formik.handleSubmit} variant="contained" color="primary">
            Update Password
          </Button>
          <Button
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ChangePassword;
