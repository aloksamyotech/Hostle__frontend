import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {FormHelperText, FormControlLabel, FormLabel, Radio, RadioGroup,IconButton } from '@mui/material';
import { useFormik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import {addStudentValidationSchema, editStudentValidationSchema } from 'views/Validation/validationSchema';
import { useEffect } from 'react';
import { State, City } from 'country-state-city';
import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

const AddStudent = (props) => {
  const { open, handleClose, editStudentData,adminid} = props;
  console.log("props==>",props);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const navigate = useNavigate();

  // Set form values when editAdminData found
  useEffect(() => {
    if (open && editStudentData) {
      const formattedDate = moment(editStudentData.dateOfBirth).format('YYYY-MM-DD');
      formik.setValues({
        firstName: editStudentData.firstname || '',
        lastName: editStudentData.lastname || '',
        dateOfBirth: formattedDate || '',
        phoneNumber: editStudentData.phonenumber || '',
        gender: editStudentData.gender || '',
        aadharCardId: editStudentData.aadharcardId || '',
        state: editStudentData.state || '',
        city: editStudentData.city || '',
        address: editStudentData.address || '',
        photo: editStudentData.photo || '',
        studentHosId: editStudentData.studentHosId || '',
      });
      setSelectedState(editStudentData.state || '');
      setCurrentPhoto(editStudentData.photo?.name || '');
    }
  }, [open,editStudentData]);
  
  // Get All States By Country Code
  useEffect(() => { 
    const countryCode = 'IN';
    const fetchAllStates = async () => {
      const allStates = State.getStatesOfCountry(countryCode);
      setStates(allStates);
    }
    fetchAllStates();
  }, []);
  console.log("states==>",states);

  // Set State Here
  const handleStateChange = (e) => {
    const getSelectedState = e.target.value;
    console.log('getSelectedState=>',getSelectedState);
    formik.handleChange(e);
    setSelectedState(getSelectedState);
  }

  // Get Cities By Selected State
  useEffect(() => {
    if (selectedState) {
      console.log("in second useEffect for fetching cities..",selectedState);
      const fetchCities = async () => {
        const allCities = City.getCitiesOfState('IN', selectedState); 
        setCities(allCities);
        console.log("allCities==>",allCities);
      }
      fetchCities();
    }
  }, [selectedState]);
  console.log("cities==>",cities);


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      aadharCardId: '',
      state: '',
      city: '',
      address: '',
      photo: '',
      studentHosId: '',
    },
    validationSchema: editStudentData ? editStudentValidationSchema : addStudentValidationSchema,

    //Submit Or Add Admin Data 
      onSubmit:  async (values) => {
      console.log('Form is valid ====>', values);
      
      const formData = new FormData();
      Object.keys(values).forEach((key)=>{
        if(key === 'photo' && values.photo){
          formData.append('photo', values.photo);
        }else{
          formData.append(key, values[key]);
        }
      });

      // Log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(`formData==> ${key}: ${value}`);
      }

      try{
        let response;
        if(editStudentData){
          response = await axios.put(`${REACT_APP_BACKEND_URL}/student/edit/${editStudentData._id}`,formData,{
            headers: {
              'Authorization': `Bearer ${Cookies.get('Admin_Token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }else{
          response = await axios.post(`${REACT_APP_BACKEND_URL}/student/add/${adminid}`,formData,{
            headers : {
              'Authorization': `Bearer ${Cookies.get('Admin_Token')}`,
              "Content-Type" : 'multipart/form-data'
            }
          });
        }
        console.log("response==>",response);
        console.log("response.data==>",response.data);

        if (response.status === 200 || response.status === 201) {
          console.log('Student Data Add Successfully');
          handleClose();
        } else{
          console.error('Failed to save Hostel');
        }
      }catch(error){
        console.log("Found Error =>", error);
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editStudentData) {
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
          <Typography variant="h6">Resident Basic Information</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer'}} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>

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
                <FormLabel>Phone number</FormLabel>
                  <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    size="small"
                    type="number"
                    fullWidth
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  />
              </Grid>


              {editStudentData ? 
              (null) 
              : 
              (<>
                <Grid item xs={12} sm={6}>
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
                      ),
                    }}
                  />
                </Grid>
              </>)
              }

              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <FormLabel>Gender</FormLabel>
                    <RadioGroup row name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male"/>
                      <FormControlLabel value="Female" control={<Radio />} label="Female"/>
                    </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Aadhar Card ID</FormLabel>
                  <TextField
                    id="aadharCardId"
                    name="aadharCardId"
                    size="small"
                    fullWidth
                    value={formik.values.aadharCardId}
                    onChange={formik.handleChange}
                    error={formik.touched.aadharCardId && !!formik.errors.aadharCardId}
                    helperText={formik.touched.aadharCardId && formik.errors.aadharCardId}
                  />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>State</FormLabel>
                  <Select
                    id="state"
                    name="state"
                    size="small"
                    fullWidth
                    value={formik.values.state}
                    onChange={handleStateChange}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state.isoCode} value={state.isoCode}>{state.name}</MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && formik.errors.state ? (
                    <FormHelperText error>{formik.errors.state}</FormHelperText>
                  ) : null}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>City</FormLabel>
                  <Select
                    id="city"
                    name="city"
                    size="small"
                    fullWidth
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                    </Select>
                    {formik.touched.city && formik.errors.city ? (
                      <FormHelperText error>{formik.errors.city}</FormHelperText>
                    ) : null}
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

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Photo</FormLabel>
                  <TextField
                    id="photo"
                    name="photo"
                    type="file"
                    size="small"
                    fullWidth
                    onChange={(event) => {
                      formik.setFieldValue("photo", event.currentTarget.files[0]);
                      setCurrentPhoto(event.currentTarget.files[0]); 
                    }}
                    error={formik.touched.photo && !!formik.errors.photo} 
                    helperText={formik.touched.photo && formik.errors.photo}
                  />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Student Hostel Id</FormLabel>
                  <TextField
                    id="studentHosId"
                    name="studentHosId"
                    size="small"
                    fullWidth
                    value={formik.values.studentHosId}
                    onChange={formik.handleChange}
                    error={formik.touched.studentHosId && !!formik.errors.studentHosId}
                    helperText={formik.touched.studentHosId && formik.errors.studentHosId}
                  />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit"> Save </Button>
          <Button onClick={() => {handleClose()}} variant="outlined" color="error"> Cancel </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AddStudent;
