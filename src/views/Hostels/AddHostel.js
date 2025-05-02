import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { hostelNewValidationSchema, editHostelValidationSchema } from 'views/Validation/validationSchema';
import { State, City } from 'country-state-city';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AddHostel = (props) => {
  const { open, handleClose, editHostelData } = props;

  console.log('props==========>', props);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const formik = useFormik({
    initialValues: {
      hostelName: '',
      hostelPhoneNumber: '',
      ownerName: '',
      ownerPhoneNumber: '',
      email: '',
      password: '',
      state: '',
      city: '',
      address: '',
      hostelphoto: '',
      aadharphoto: ''
    },

    validationSchema: editHostelData ? editHostelValidationSchema : hostelNewValidationSchema,

    onSubmit: async (values) => {
      console.log('Form is valid =======>', values);

      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === 'hostelphoto') {
          formData.append('hostelphoto', values.hostelphoto);
        } else if (key === 'aadharphoto') {
          formData.append('aadharphoto', values.aadharphoto);
        } else {
          formData.append(key, values[key]);
        }
      });

      for (let [key, value] of formData.entries()) {
        console.log(`formData==> ${key}: ${value}`);
      }

      try {
        let response;
        if (editHostelData) {
          response = await axios.put(`${REACT_APP_BACKEND_URL}/hostel/edit/${editHostelData._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          response = await axios.post(`${REACT_APP_BACKEND_URL}/hostel/addnew`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        if (response.status === 201) {
          console.log('Hostel Data Add Successfully !!');
          toast.success('Hostel Data Add Successfully !!');
        } else if (response.status === 200) {
          console.log('Hostel Data Update Successfully !!');
          toast.success('Hostel Data Update Successfully !!');
        } else {
          toast.error('Failed to Save Hostel Data !!');
          console.error('Failed to Save Hostel Data !!');
        }
        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Found Error =>', error);
      }
    }
  });

  useEffect(() => {
    const countryCode = 'IN';
    const fetchAllStates = async () => {
      const allStates = State.getStatesOfCountry(countryCode);
      setStates(allStates);
    };
    fetchAllStates();
  }, []);

  const handleStateChange = (e) => {
    const getSelectedState = e.target.value;
    formik.handleChange(e);
    setSelectedState(getSelectedState);
  };

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        const allCities = City.getCitiesOfState('IN', selectedState);
        setCities(allCities);
      };
      fetchCities();
    }
  }, [selectedState]);

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setSelectedState('');
      setCities([]);
    }
  }, [open]);

  useEffect(() => {
    if (open && editHostelData) {
      formik.setValues({
        hostelName: editHostelData.hostelName || '',
        hostelPhoneNumber: editHostelData.hostelPhoneNumber || '',
        ownerName: editHostelData.ownerName || '',
        ownerPhoneNumber: editHostelData.ownerPhoneNumber || '',
        // email: editHostelData.email || '',
        // password: '',
        state: editHostelData.state || '',
        city: editHostelData.city || '',
        address: editHostelData.address || '',
        hostelphoto: editHostelData.hostelphoto || '',
        aadharphoto: editHostelData.aadharphoto || ''
      });
      setSelectedState(editHostelData.state || '');
    }
  }, [open, editHostelData]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Hostel Basic Information</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Hostel Name</FormLabel>
                <TextField
                  id="hostelName"
                  name="hostelName"
                  size="small"
                  fullWidth
                  value={formik.values.hostelName}
                  onChange={formik.handleChange}
                  error={formik.touched.hostelName && !!formik.errors.hostelName}
                  helperText={formik.touched.hostelName && formik.errors.hostelName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Hostel Phone Number</FormLabel>
                <TextField
                  id="hostelPhoneNumber"
                  name="hostelPhoneNumber"
                  size="small"
                  fullWidth
                  value={formik.values.hostelPhoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.hostelPhoneNumber && !!formik.errors.hostelPhoneNumber}
                  helperText={formik.touched.hostelPhoneNumber && formik.errors.hostelPhoneNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Owner Name</FormLabel>
                <TextField
                  id="ownerName"
                  name="ownerName"
                  size="small"
                  fullWidth
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                  error={formik.touched.ownerName && !!formik.errors.ownerName}
                  helperText={formik.touched.ownerName && formik.errors.ownerName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Owner Phone Number</FormLabel>
                <TextField
                  id="ownerPhoneNumber"
                  name="ownerPhoneNumber"
                  size="small"
                  fullWidth
                  value={formik.values.ownerPhoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.ownerPhoneNumber && !!formik.errors.ownerPhoneNumber}
                  helperText={formik.touched.ownerPhoneNumber && formik.errors.ownerPhoneNumber}
                />
              </Grid>

              {editHostelData ? null : (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Email</FormLabel>
                    <TextField
                      id="email"
                      name="email"
                      size="small"
                      fullWidth
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && !!formik.errors.email}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>Password</FormLabel>
                    <TextField
                      id="password"
                      name="password"
                      size="small"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && !!formik.errors.password}
                      helperText={formik.touched.password && formik.errors.password}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        )
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <FormLabel>Hostel Photo</FormLabel>
                <TextField
                  id="hostelphoto"
                  name="hostelphoto"
                  type="file"
                  size="small"
                  onChange={(event) => {
                    formik.setFieldValue('hostelphoto', event.currentTarget.files[0]);
                  }}
                />
                {formik.touched.hostelphoto && formik.errors.hostelphoto && (
                  <FormHelperText error>{formik.errors.hostelphoto}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Aadhar Card Photo</FormLabel>
                <TextField
                  id="aadharphoto"
                  name="aadharphoto"
                  type="file"
                  size="small"
                  onChange={(event) => {
                    formik.setFieldValue('aadharphoto', event.currentTarget.files[0]);
                  }}
                />
                {formik.touched.aadharphoto && formik.errors.aadharphoto && (
                  <FormHelperText error>{formik.errors.aadharphoto}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>State</FormLabel>
                <Select id="state" name="state" size="small" fullWidth value={formik.values.state} onChange={handleStateChange}>
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.state && formik.errors.state ? <FormHelperText error>{formik.errors.state}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>City</FormLabel>
                <Select id="city" name="city" size="small" fullWidth value={formik.values.city} onChange={formik.handleChange}>
                  <MenuItem value="">Select City</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.city && formik.errors.city ? <FormHelperText error>{formik.errors.city}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Address</FormLabel>
                <TextField
                  id="address"
                  name="address"
                  size="small"
                  multiline
                  fullWidth
                  rows={4}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && !!formik.errors.address}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddHostel;
