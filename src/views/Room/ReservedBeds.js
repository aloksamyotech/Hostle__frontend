import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { ToastContainer, toast } from 'react-toastify';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  Input,
  Checkbox
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import { addStudentValidationSchema, editStudentValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';
import { State, City } from 'country-state-city';
import { addReservedBedValidationSchema } from 'views/Validation/validationSchema';

const ReservedBeds = (props) => {
  const { open, handleClose, hostelId, editStudent, roomData, bedNo } = props;

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [originalFinalRent, setOriginalFinalRent] = useState();
  const [typingTimeout, setTypingTimeout] = useState(0);

  const formik = useFormik({
    initialValues: {
      roomType: '',
      roomNumber: '',
      bedNumber: '',
      roomRent: '',
      startDate: '',
      endDate: '',
      stayMonths: '',
      totalRent: '',
      finalTotalRent: '',
      advanceAmount: '',
      discount: '',

      foodFacility: false,
      foodFee: 0,
      libraryFacility: false,
      libraryFee: 0,

      studentName: '',
      studentContact: '',
      fatherName: '',
      fatherContact: '',
      guardianName: '',
      guardianContactNo: '',
      guardiansAddress: '',
      dob: '',
      gender: '',
      mailId: '',
      courseOccupation: '',
      address: '',
      studentPhoto: '',
      aadharPhoto: '',
      studentId: ''
    },

    validationSchema: addReservedBedValidationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append('roomType', values.roomType);
      formData.append('roomNumber', values.roomNumber);
      formData.append('bedNumber', values.bedNumber);
      formData.append('roomRent', values.roomRent);
      formData.append('startDate', values.startDate);
      formData.append('endDate', values.endDate);
      formData.append('stayMonths', values.stayMonths);
      formData.append('totalRent', values.totalRent);
      formData.append('finalTotalRent', values.finalTotalRent);
      formData.append('advanceAmount', values.advanceAmount);
      formData.append('discount', values.discount);
      formData.append('foodFee', values.foodFee);
      formData.append('libraryFee', values.libraryFee);
      formData.append('studentName', values.studentName);
      formData.append('studentContact', values.studentContact);
      formData.append('fatherName', values.fatherName);
      formData.append('fatherContact', values.fatherContact);
      formData.append('guardianName', values.guardianName);
      formData.append('guardianContactNo', values.guardianContactNo);
      formData.append('guardiansAddress', values.guardiansAddress);
      formData.append('dob', values.dob);
      formData.append('gender', values.gender);
      formData.append('mailId', values.mailId);
      formData.append('courseOccupation', values.courseOccupation);
      formData.append('address', values.address);
      formData.append('studentId', values.studentId);

      if (values.studentPhoto) {
        formData.append('studentPhoto', values.studentPhoto);
      }

      if (values.aadharPhoto) {
        formData.append('aadharPhoto', values.aadharPhoto);
      }

      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/sudent_reservation/assignBed/${hostelId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 201) {
          toast.success('Bed assigned to the student successfully');
        } else {
          toast.error('Failed to assign bed to the student');
        }
        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error=>', error);
        toast.error('Something went wrong !!');
      }
    }
  });

  function monthDiffInclusive(start, end) {
    const s = new Date(start),
      e = new Date(end);
    if (e <= s) return 0;
    let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (e.getDate() > s.getDate()) months++;

    return months;
  }

  useEffect(() => {
    const { startDate, endDate, foodFacility, libraryFacility } = formik.values;
    if (startDate && endDate) {
      const months = monthDiffInclusive(startDate, endDate);
      formik.setFieldValue('stayMonths', months);

      const roomRent = roomData?.roomPrice || 0;
      const foodFee = foodFacility ? Number(formik.values.foodFee || 0) : 0;
      const libraryFee = libraryFacility ? Number(formik.values.libraryFee || 0) : 0;

      const facilityFeePerMonth = foodFee + libraryFee;
      const totalRent = months * (roomRent + facilityFeePerMonth);

      formik.setFieldValue('totalRent', totalRent);
      formik.setFieldValue('finalTotalRent', totalRent);
      setOriginalFinalRent(totalRent);
    }
  }, [
    formik.values.startDate,
    formik.values.endDate,
    formik.values.foodFacility,
    formik.values.libraryFacility,
    formik.values.foodFee,
    formik.values.libraryFee
  ]);

  useEffect(() => {
    if (roomData && bedNo) {
      formik.setFieldValue('roomType', roomData?.roomType || '');
      formik.setFieldValue('roomNumber', roomData?.roomNumber || '');
      formik.setFieldValue('bedNumber', bedNo || '');
      formik.setFieldValue('roomRent', roomData?.roomPrice || '');
    }
  }, [roomData, bedNo]);

  const recalculateFinalRent = (advanceAmount, discount) => {
    const a = Number(advanceAmount) || 0;
    const d = Number(discount) || 0;

    if (a < 0 || d < 0) {
      formik.setFieldValue('finalTotalRent', originalFinalRent);
      return;
    }

    const newFinal = originalFinalRent - a - d;
    formik.setFieldValue('finalTotalRent', newFinal >= 0 ? newFinal : originalFinalRent);
  };

  const handleStudentContactChange = (e) => {
    const value = e.target.value;

    formik.setFieldValue('studentContact', value);
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      // if (value.length === 10) {
      //   fetchStudentData(value);
      // }
      fetchStudentData(value);
    }, 500);

    setTypingTimeout(timeout);
  };

  const fetchStudentData = async (contactNumber) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/getStudentByContact/${contactNumber}`);

      if (!response?.data?.data) {
        // Reset only the student-related fields if student not found
        formik.setValues({
          ...formik.values,
          studentContact: contactNumber, // keep the typed value
          studentName: '',
          fatherName: '',
          fatherContact: '',
          dob: '',
          gender: '',
          mailId: '',
          courseOccupation: '',
          address: '',
          guardianName: '',
          guardianContactNo: '',
          guardiansAddress: '',
          studentId: ''
        });
      } else {
        const student = response.data.data;

        // Populate form fields with student data
        formik.setFieldValue('studentName', student.studentName);
        formik.setFieldValue('fatherName', student.fatherName);
        formik.setFieldValue('fatherContact', student.fatherContact);
        formik.setFieldValue('dob', new Date(student.dob).toISOString().split('T')[0]);
        formik.setFieldValue('gender', student.gender);
        formik.setFieldValue('mailId', student.mailId);
        formik.setFieldValue('courseOccupation', student.courseOccupation);
        formik.setFieldValue('address', student.address);
        formik.setFieldValue('guardianName', student.guardianName);
        formik.setFieldValue('guardianContactNo', student.guardianContactNo);
        formik.setFieldValue('guardiansAddress', student.guardiansAddress);
        formik.setFieldValue('studentId', student._id);
      }
    } catch (error) {
      console.error('Student not found or API error', error);

      // Optional: Also reset student fields on error
      formik.setValues({
        ...formik.values,
        studentContact: contactNumber,
        studentName: '',
        fatherName: '',
        fatherContact: '',
        dob: '',
        gender: '',
        mailId: '',
        courseOccupation: '',
        address: '',
        guardianName: '',
        guardianContactNo: '',
        guardiansAddress: '',
        studentId: ''
      });
    }
  };

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
          <Typography variant="h6">Assign Bed to the Student</Typography>
          <Typography>
            <ClearIcon
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
              style={{ cursor: 'pointer' }}
            />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Room Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Type</FormLabel>
                <TextField
                  id="roomType"
                  name="roomType"
                  size="small"
                  fullWidth
                  aria-readonly
                  value={formik.values.roomType}
                  InputProps={{
                    readOnly: true
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.roomType && !!formik.errors.roomType}
                  helperText={formik.touched.roomType && formik.errors.roomType}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Number</FormLabel>
                <TextField
                  id="roomNumber"
                  name="roomNumber"
                  size="small"
                  fullWidth
                  value={roomData?.roomNumber}
                  InputProps={{
                    readOnly: true
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.roomNumber && !!formik.errors.roomNumber}
                  helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Bed Number</FormLabel>
                <TextField
                  id="bedNumber"
                  name="bedNumber"
                  size="small"
                  fullWidth
                  value={formik.values.bedNumber}
                  InputProps={{
                    readOnly: true
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.bedNumber && !!formik.errors.bedNumber}
                  helperText={formik.touched.bedNumber && formik.errors.bedNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Rent (Per Month)</FormLabel>
                <TextField
                  id="roomRent"
                  name="roomRent"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.roomRent}
                  InputProps={{
                    readOnly: true
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.roomRent && !!formik.errors.roomRent}
                  helperText={formik.touched.roomRent && formik.errors.roomRent}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Start Date <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  error={formik.touched.startDate && !!formik.errors.startDate}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  End Date <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="endDate"
                  name="endDate"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  error={formik.touched.endDate && !!formik.errors.endDate}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>No. of Stay Months</FormLabel>
                <TextField
                  id="stayMonths"
                  name="stayMonths"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                  value={formik.values.stayMonths}
                  onChange={formik.handleChange}
                  error={formik.touched.stayMonths && !!formik.errors.stayMonths}
                  helperText={formik.touched.stayMonths && formik.errors.stayMonths}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Total Rent</FormLabel>
                <TextField
                  id="totalRent"
                  name="totalRent"
                  size="small"
                  fullWidth
                  value={formik.values.totalRent}
                  onChange={formik.handleChange}
                  disabled
                />
              </Grid>

              {/* Other Facility Information Title */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Other Facility (Optional)
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="foodFacility"
                      name="foodFacility"
                      checked={formik.values.foodFacility}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        formik.setFieldValue('foodFacility', checked);
                        formik.setFieldValue('foodFee', checked ? formik.values.foodFee : 0);
                      }}
                    />
                  }
                  label="Food Facility"
                />
                <TextField
                  id="foodFee"
                  name="foodFee"
                  type="number"
                  size="small"
                  fullWidth
                  label="Food Facility Price"
                  disabled={!formik.values.foodFacility}
                  value={formik.values.foodFee}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="libraryFacility"
                      name="libraryFacility"
                      checked={formik.values.libraryFacility}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        formik.setFieldValue('libraryFacility', checked);
                        formik.setFieldValue('libraryFee', checked ? formik.values.libraryFee : 0);
                      }}
                    />
                  }
                  label="Library Facility"
                />
                <TextField
                  id="libraryFee"
                  name="libraryFee"
                  type="number"
                  size="small"
                  fullWidth
                  label="Library Facility Price"
                  disabled={!formik.values.libraryFacility}
                  value={formik.values.libraryFee}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Advance Amount</FormLabel>
                <TextField
                  id="advanceAmount"
                  name="advanceAmount"
                  size="small"
                  fullWidth
                  value={formik.values.advanceAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue('advanceAmount', value);
                    recalculateFinalRent(value, formik.values.discount);
                  }}
                  error={formik.touched.advanceAmount && !!formik.errors.advanceAmount}
                  helperText={formik.touched.advanceAmount && formik.errors.advanceAmount}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Final Total Rent</FormLabel>
                <TextField
                  id="finalTotalRent"
                  name="finalTotalRent"
                  size="small"
                  fullWidth
                  value={formik.values.finalTotalRent}
                  InputProps={{
                    readOnly: true
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue('finalTotalRent', value);
                    setOriginalFinalRent(value);
                  }}
                  error={formik.touched.finalTotalRent && !!formik.errors.finalTotalRent}
                  helperText={formik.touched.finalTotalRent && formik.errors.finalTotalRent}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Discount on Final Rent</FormLabel>
                <TextField
                  id="discount"
                  name="discount"
                  size="small"
                  fullWidth
                  value={formik.values.discount}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue('discount', value);
                    recalculateFinalRent(value, formik.values.advanceAmount);
                  }}
                  error={formik.touched.discount && !!formik.errors.discount}
                  helperText={formik.touched.discount && formik.errors.discount}
                />
              </Grid>

              {/* Student Information Title */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Student Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Student Contact No. <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="studentContact"
                  name="studentContact"
                  size="small"
                  fullWidth
                  value={formik.values.studentContact}
                  // onChange={formik.handleChange}
                  onChange={handleStudentContactChange}
                  error={formik.touched.studentContact && !!formik.errors.studentContact}
                  helperText={formik.touched.studentContact && formik.errors.studentContact}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Student Name <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="studentName"
                  name="studentName"
                  size="small"
                  fullWidth
                  value={formik.values.studentName}
                  onChange={formik.handleChange}
                  error={formik.touched.studentName && !!formik.errors.studentName}
                  helperText={formik.touched.studentName && formik.errors.studentName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Fathers Name <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="fatherName"
                  name="fatherName"
                  size="small"
                  fullWidth
                  value={formik.values.fatherName}
                  onChange={formik.handleChange}
                  error={formik.touched.fatherName && !!formik.errors.fatherName}
                  helperText={formik.touched.fatherName && formik.errors.fatherName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Fathers Contact No. <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="fatherContact"
                  name="fatherContact"
                  size="small"
                  fullWidth
                  value={formik.values.fatherContact}
                  onChange={formik.handleChange}
                  error={formik.touched.fatherContact && !!formik.errors.fatherContact}
                  helperText={formik.touched.fatherContact && formik.errors.fatherContact}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Date of Birth <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="dob"
                  name="dob"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  error={formik.touched.dob && !!formik.errors.dob}
                  helperText={formik.touched.dob && formik.errors.dob}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Gender <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="gender"
                  name="gender"
                  size="small"
                  fullWidth
                  select
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.touched.gender && !!formik.errors.gender}
                  helperText={formik.touched.gender && formik.errors.gender}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Email Id <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="mailId"
                  name="mailId"
                  size="small"
                  fullWidth
                  value={formik.values.mailId}
                  onChange={formik.handleChange}
                  error={formik.touched.mailId && !!formik.errors.mailId}
                  helperText={formik.touched.mailId && formik.errors.mailId}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Course / Occupation</FormLabel>
                <TextField
                  id="courseOccupation"
                  name="courseOccupation"
                  size="small"
                  fullWidth
                  value={formik.values.courseOccupation}
                  onChange={formik.handleChange}
                  error={formik.touched.courseOccupation && !!formik.errors.courseOccupation}
                  helperText={formik.touched.courseOccupation && formik.errors.courseOccupation}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormLabel>
                  Address <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="address"
                  name="address"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && !!formik.errors.address}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>

              {/* Uploads */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Upload Student Photo</FormLabel>
                <Input
                  id="studentPhoto"
                  name="studentPhoto"
                  type="file"
                  onChange={(event) => formik.setFieldValue('studentPhoto', event.currentTarget.files[0])}
                />
                {formik.touched.studentPhoto && formik.errors.studentPhoto && (
                  <div
                    style={{
                      color: '#f44336',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                      marginRight: '14px',
                      marginLeft: '14px',
                      fontFamily: 'Roboto,sans-serif',
                      fontWeight: '400'
                    }}
                  >
                    {formik.errors.studentPhoto}
                  </div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Upload AadharCard Photo</FormLabel>
                <Input
                  id="aadharPhoto"
                  name="aadharPhoto"
                  type="file"
                  onChange={(event) => formik.setFieldValue('aadharPhoto', event.currentTarget.files[0])}
                />
                {formik.touched.aadharPhoto && formik.errors.aadharPhoto && (
                  <div
                    style={{
                      color: '#f44336',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                      marginRight: '14px',
                      marginLeft: '14px',
                      fontFamily: 'Roboto,sans-serif',
                      fontWeight: '400'
                    }}
                  >
                    {formik.errors.aadharPhoto}
                  </div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Guardians Name</FormLabel>
                <TextField
                  id="guardianName"
                  name="guardianName"
                  size="small"
                  fullWidth
                  value={formik.values.guardianName}
                  onChange={formik.handleChange}
                  error={formik.touched.guardianName && !!formik.errors.guardianName}
                  helperText={formik.touched.guardianName && formik.errors.guardianName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Guardians Contact No.</FormLabel>
                <TextField
                  id="guardianContactNo"
                  name="guardianContactNo"
                  size="small"
                  fullWidth
                  value={formik.values.guardianContactNo}
                  onChange={formik.handleChange}
                  error={formik.touched.guardianContactNo && !!formik.errors.guardianContactNo}
                  helperText={formik.touched.guardianContactNo && formik.errors.guardianContactNo}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormLabel>Guardians Full Address</FormLabel>
                <TextField
                  id="guardiansAddress"
                  name="guardiansAddress"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={formik.values.guardiansAddress}
                  onChange={formik.handleChange}
                  error={formik.touched.guardiansAddress && !!formik.errors.guardiansAddress}
                  helperText={formik.touched.guardiansAddress && formik.errors.guardiansAddress}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            Save
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

export default ReservedBeds;
