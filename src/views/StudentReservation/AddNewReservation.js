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
  Checkbox,
  Input,
  FormGroup
} from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { addReservedBedValidationSchema } from 'views/Validation/validationSchema';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';

const AddNewReservation = (props) => {
  const { open, handleClose, hostelId } = props;

  const [roomTypes, setRoomTypes] = useState([]);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const [originalFinalRent, setOriginalFinalRent] = useState();

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const formik = useFormik({
    initialValues: {
      roomCategory: '',
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
      aadharPhoto: ''
    },

    validationSchema: addReservedBedValidationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append('roomCategory', values.roomCategory);
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

  const fetchRoomTypesData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/roomTypes/getall/${hostelId}`);
      setRoomTypes(response.data.result);
    } catch (error) {
      console.error('Error fetching Room Type Data:', error);
    }
  };

  const fetchRoomData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/room/index/${hostelId}`);
      setRoomNumbers(response.data.result);
    } catch (error) {
      console.error('Error fetching Room Type Data:', error);
    }
  };

  useEffect(() => {
    fetchRoomTypesData(hostelId);
    fetchRoomData(hostelId);
  }, [formik.values.roomCategory, formik.values.roomType]);

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

      const roomRent = selectedRoomData?.roomPrice || 0;
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
                <FormLabel>Room Category</FormLabel>
                <Select
                  id="roomCategory"
                  name="roomCategory"
                  size="small"
                  fullWidth
                  value={formik.values.roomCategory}
                  onChange={formik.handleChange}
                  error={formik.touched.roomCategory && !!formik.errors.roomCategory}
                >
                  <MenuItem value="">Select Room Category</MenuItem>
                  <MenuItem value="AC">AC</MenuItem>
                  <MenuItem value="Non-AC">Non-AC</MenuItem>
                </Select>
                {formik.touched.roomCategory && formik.errors.roomCategory && (
                  <FormHelperText error>{formik.errors.roomCategory}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Type</FormLabel>
                <Select
                  id="roomType"
                  name="roomType"
                  size="small"
                  fullWidth
                  value={formik.values.roomType}
                  onChange={formik.handleChange}
                  error={formik.touched.roomType && !!formik.errors.roomType}
                >
                  <MenuItem value="">Select Room Type</MenuItem>
                  {roomTypes
                    ?.filter((type) => type.roomCategory === formik.values.roomCategory)
                    .map((type) => (
                      <MenuItem key={type._id} value={type.roomType}>
                        {type.roomType}
                      </MenuItem>
                    ))}
                </Select>
                {formik.touched.roomType && formik.errors.roomType && <FormHelperText error>{formik.errors.roomType}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Number</FormLabel>
                <Select
                  id="roomNumber"
                  name="roomNumber"
                  size="small"
                  fullWidth
                  value={formik.values.roomNumber}
                  // onChange={formik.handleChange}

                  onChange={(e) => {
                    const selectedNumber = e.target.value;
                    formik.setFieldValue('roomNumber', selectedNumber);

                    const fullRoomData = roomNumbers.find((room) => room.roomNumber === selectedNumber);
                    setSelectedRoomData(fullRoomData);
                    formik.setFieldValue('roomRent', fullRoomData?.roomPrice);
                  }}
                  error={formik.touched.roomNumber && !!formik.errors.roomNumber}
                >
                  <MenuItem value="">Select Room Number</MenuItem>
                  {roomNumbers
                    ?.filter((room) => room.roomType === formik.values.roomType && room.availableBeds !== 0)
                    .map((room) => (
                      <MenuItem key={room._id} value={room.roomNumber}>
                        {room.roomNumber}
                      </MenuItem>
                    ))}
                </Select>
                {formik.touched.roomNumber && formik.errors.roomNumber && <FormHelperText error>{formik.errors.roomNumber}</FormHelperText>}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Bed Numbers</FormLabel>
                <Select
                  labelId="bedNumber-label"
                  id="bedNumber"
                  name="bedNumber"
                  size="small"
                  fullWidth
                  value={formik.values.bedNumber || ''}
                  onChange={formik.handleChange}
                  disabled={!selectedRoomData?.beds?.length}
                >
                  {selectedRoomData?.beds?.length > 0 ? (
                    selectedRoomData.beds.map((bed) =>
                      bed.status === 'available' ? (
                        <MenuItem key={bed.bedNumber} value={bed.bedNumber}>
                          Bed {bed.bedNumber} ({bed.status})
                        </MenuItem>
                      ) : null
                    )
                  ) : (
                    <MenuItem disabled>No beds available</MenuItem>
                  )}
                </Select>
                {formik.touched.bedNumber && formik.errors.bedNumber && <FormHelperText error>{formik.errors.bedNumber}</FormHelperText>}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Start Date</FormLabel>
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
                <FormLabel>End Date</FormLabel>
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
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue('finalTotalRent', value);
                    setOriginalFinalRent(value);
                  }}
                  InputProps={{
                    readOnly: true
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
                <FormLabel>Student Name</FormLabel>
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
                <FormLabel>Student Contact No.</FormLabel>
                <TextField
                  id="studentContact"
                  name="studentContact"
                  size="small"
                  fullWidth
                  value={formik.values.studentContact}
                  onChange={formik.handleChange}
                  error={formik.touched.studentContact && !!formik.errors.studentContact}
                  helperText={formik.touched.studentContact && formik.errors.studentContact}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Fathers Name</FormLabel>
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
                <FormLabel>Fathers Contact No.</FormLabel>
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
                <FormLabel>Date of Birth</FormLabel>
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
                <FormLabel>Gender</FormLabel>
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
                <FormLabel>Email ID</FormLabel>
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
                <FormLabel>Full Address</FormLabel>
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
                <FormLabel>Local Guardians Name</FormLabel>
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
                <FormLabel>Local Guardians Contact No.</FormLabel>
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
                <FormLabel>Local Guardians Full Address</FormLabel>
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

export default AddNewReservation;
