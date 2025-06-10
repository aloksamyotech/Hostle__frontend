import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import {
  administratorValidationSchema,
  addAdminValidationSchema,
  editAdminValidationSchema
} from '../../views/Validation/validationSchema';
import { State, City } from 'country-state-city';
import axios from 'axios';
import { useEffect } from 'react';
import { decryptPassword } from 'utils/externalFun.js';
import moment from 'moment';

const AddAdministrator = (props) => {
  const { open, handleClose, editAdminData } = props;

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //Set Data on Feilds When Found editAdminData
  useEffect(() => {
    if (open && editAdminData) {
      const formattedDate = moment(editAdminData.dateOfBirth).format('YYYY-MM-DD');
      formik.setValues({
        hostelId: editAdminData.hostelId || '',
        firstName: editAdminData.firstname || '',
        lastName: editAdminData.lastname || '',
        dateOfBirth: formattedDate || '',
        gender: editAdminData.gender || '',
        phoneNumber: editAdminData.phonenumber || '',
        aadharCard: editAdminData.aadharcardId || '',
        state: editAdminData.state || '',
        city: editAdminData.city || '',
        address: editAdminData.address || '',
        photo: editAdminData.photo || ''
      });
      setSelectedState(editAdminData.state || '');
      setCurrentPhoto(editAdminData.photo?.name || '');
    }
  }, [open, editAdminData]);

  const formik = useFormik({
    initialValues: {
      hostelId: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      aadharCard: '',
      state: '',
      city: '',
      address: '',
      photo: ''
    },
    validationSchema: editAdminData ? editAdminValidationSchema : addAdminValidationSchema,

    //Submit / Add Admin Data
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'photo' && values.photo) {
          formData.append('photo', values.photo);
        } else {
          formData.append(key, values[key]);
        }
      });

      try {
        let response;
        if (editAdminData) {
          // Update Admin
          response = await axios.put(`${REACT_APP_BACKEND_URL}/administrator/edit/${editAdminData._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // Add New Admin
          response = await axios.post(`${REACT_APP_BACKEND_URL}/administrator/add`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        if (response.status === 200 || response.status === 201) {
          handleClose();
        } else {
          console.error('Failed to save Hostel');
        }
      } catch (error) {
        console.log('Found Error =>', error);
      }
    }
  });

  // Get All Hostel's Name
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/hostel/list`)
      .then((response) => {
        if (Array.isArray(response.data.result)) {
          const filteredHostels = response.data.result.filter((hostel) => hostel.isAdmin !== 'true');

          setHostels(filteredHostels);
        } else {
          console.log('Unexpected response structure:', response.data.result);
        }
      })
      .catch((error) => {
        console.log('Error Found While Fetching Hostels Data', error);
      });
  }, []);

  // Get All States By Country Code
  useEffect(() => {
    const countryCode = 'IN';
    const fetchAllStates = async () => {
      const allStates = State.getStatesOfCountry(countryCode);
      setStates(allStates);
    };
    fetchAllStates();
  }, []);

  // Set State Here
  const handleStateChange = (e) => {
    const getSelectedState = e.target.value;

    formik.handleChange(e);
    setSelectedState(getSelectedState);
  };

  // Get Cities By Selected State
  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        const allCities = City.getCitiesOfState('IN', selectedState);
        setCities(allCities);
      };
      fetchCities();
    }
  }, [selectedState]);

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editAdminData) {
      formik.resetForm();
      setSelectedState('');
      setCities([]);
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Hostel Administrator</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12}>
                  <FormLabel>Select Hostel By Id</FormLabel>
                  {editAdminData ? (
                    <TextField
                      id="hostelId"
                      name="hostelId"
                      size="small"
                      fullWidth
                      value={editAdminData.hostelname}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  ) : (
                    <>
                      <Select
                        id="hostelId"
                        name="hostelId"
                        size="small"
                        fullWidth
                        value={formik.values.hostelId}
                        onChange={formik.handleChange}
                        error={formik.touched.hostelId && !!formik.errors.hostelId}
                      >
                        <MenuItem value="">Select Hostel Name</MenuItem>
                        {hostels.map((hostel) => (
                          <MenuItem key={hostel._id} value={hostel.uniqueCode}>
                            {hostel.hostelName}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.hostelId && formik.errors.hostelId ? (
                        <FormHelperText error>{formik.errors.hostelId}</FormHelperText>
                      ) : null}
                    </>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>First name</FormLabel>
                  <TextField
                    id="firstName"
                    name="firstName"
                    size="small"
                    fullWidth
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && !!formik.errors.firstName}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Last name</FormLabel>
                  <TextField
                    id="lastName"
                    name="lastName"
                    size="small"
                    fullWidth
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Grid>

                {editAdminData ? null : (
                  <>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormLabel>Email ID</FormLabel>
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

                    <Grid item xs={12} sm={6} md={6}>
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

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Date Of Birth</FormLabel>
                  <TextField
                    name="dateOfBirth"
                    type="date"
                    size="small"
                    fullWidth
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup row name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Phone number</FormLabel>
                  <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    size="small"
                    type="number"
                    fullWidth
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Aadhar Card ID</FormLabel>
                  <TextField
                    id="aadharCard"
                    name="aadharCard"
                    size="small"
                    fullWidth
                    value={formik.values.aadharCard}
                    onChange={formik.handleChange}
                    error={formik.touched.aadharCard && !!formik.errors.aadharCard}
                    helperText={formik.touched.aadharCard && formik.errors.aadharCard}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
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

                <Grid item xs={12} sm={12} md={12}>
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

                <Grid item xs={12}>
                  <FormLabel>Photo</FormLabel>
                  <TextField
                    id="photo"
                    name="photo"
                    type="file"
                    size="small"
                    fullWidth
                    onChange={(event) => {
                      formik.setFieldValue('photo', event.currentTarget.files[0]);
                      setCurrentPhoto(event.currentTarget.files[0]);
                    }}
                    error={formik.touched.photo && !!formik.errors.photo}
                    helperText={formik.touched.photo && formik.errors.photo}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            {' '}
            Save{' '}
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            {' '}
            Cancel{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AddAdministrator;
