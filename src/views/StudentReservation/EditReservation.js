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
import { editReservedBedValidationSchema } from 'views/Validation/validationSchema';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

const EditReservation = (props) => {
  const { open, handleClose, rowData, hostelId } = props;


  const [roomTypes, setRoomTypes] = useState([]);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const formik = useFormik({
    initialValues: {
      roomCategory: rowData?.roomId?.roomCategory || '',
      roomType: rowData?.roomType || '',
      roomNumber: rowData?.roomNumber || '',
      bedNumber: rowData?.bedNumber || '',
      roomRent: rowData?.roomRent || '',
      startDate: moment(rowData?.startDate).format('YYYY-MM-DD') || '',
      endDate: moment(rowData?.endDate).format('YYYY-MM-DD') || '',
      stayMonths: rowData?.stayMonths || '',
      foodFee: rowData?.foodFee || '',
      libraryFee: rowData?.libraryFee || '',
      totalRent: rowData?.totalRent || '',
      finalTotalRent: rowData?.finalTotalRent || '',
      advanceAmount: rowData?.advanceAmount || 0,
      discount: rowData?.discount || 0
    },

    validationSchema: editReservedBedValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
   

      try {
        const response = await axios.put(`${REACT_APP_BACKEND_URL}/sudent_reservation/update/${rowData?._id}/${hostelId}`, values);
    

        if (response.status === 200) {
          toast.success('Bed details updated successfully !!');
        } else {
          toast.error('Failed to update bed details !!');
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
      setRoomNumbers(response?.data?.result);
    } catch (error) {
      console.error('Error fetching Room Type Data:', error);
    }
  };

  useEffect(() => {
    fetchRoomTypesData(hostelId);
    fetchRoomData(hostelId);
  }, [formik.values.roomCategory, formik.values.roomType]);

  useEffect(() => {
    if (rowData?.roomNumber && roomNumbers.length) {
      const room = roomNumbers.find((room) => room.roomNumber.toString() === rowData.roomNumber.toString());
      if (room) {
        setSelectedRoomData(room);
      }
    }
  }, [rowData, roomNumbers]);

  useEffect(() => {
    const { startDate, endDate } = formik.values;
    if (startDate && endDate && selectedRoomData) {
      const months = monthDiffInclusive(startDate, endDate);
      formik.setFieldValue('stayMonths', months);

      if (selectedRoomData.roomNumber !== rowData?.roomNumber) {
        const roomRent = selectedRoomData?.roomPrice || 0;
        const foodFee = Number(formik.values.foodFee || 0);
        const libraryFee = Number(formik.values.libraryFee || 0);

        const facilityFeePerMonth = foodFee + libraryFee;
        const totalRent = months * (roomRent + facilityFeePerMonth);
     
        formik.setFieldValue('totalRent', totalRent);
        let total = totalRent - (formik.values.advanceAmount + formik.values.discount);
        formik.setFieldValue('finalTotalRent', total);
      } else {
        const months = monthDiffInclusive(formik.values.startDate, formik.values.endDate);

        const roomRent = rowData?.finalTotalRent / rowData?.stayMonths || 0;

        const totalRent = months * roomRent;

   

        formik.setFieldValue('totalRent', rowData?.totalRent);
        formik.setFieldValue('finalTotalRent', totalRent);
      }
    }
  }, [formik.values.roomNumber, formik.values.startDate, formik.values.endDate]);

  function monthDiffInclusive(start, end) {
    const s = new Date(start),
      e = new Date(end);
    if (e <= s) return 0;
    let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (e.getDate() > s.getDate()) months++;

    return months;
  }

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
          <Typography variant="h6">Edit Assign Bed to the Student</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
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
                    ?.filter((room) => room.roomType === formik.values.roomType)
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
                  value={formik.values.bedNumber}
                  onChange={formik.handleChange}
                  // disabled={!selectedRoomData?.beds?.length}
                >
                  {selectedRoomData?.beds?.length > 0 ? (
                    selectedRoomData.beds.map(
                      (bed) => (
                        // bed.status === 'available' ? (
                        <MenuItem key={bed.bedNumber} value={bed.bedNumber}>
                          Bed {bed.bedNumber} ({bed.status})
                        </MenuItem>
                      )
                      // ) : null
                    )
                  ) : (
                    <MenuItem disabled>No beds available</MenuItem>
                  )}
                </Select>
                {formik.touched.bedNumber && formik.errors.bedNumber && <FormHelperText error>{formik.errors.bedNumber}</FormHelperText>}
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
                <TextField
                  id="foodFee"
                  name="foodFee"
                  type="number"
                  size="small"
                  fullWidth
                  label="Food Facility Price"
                  disabled
                  value={formik.values.foodFee}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  id="libraryFee"
                  name="libraryFee"
                  type="number"
                  size="small"
                  fullWidth
                  label="Library Facility Price"
                  disabled
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
                  onChange={formik.handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Discount</FormLabel>
                <TextField
                  id="discount"
                  name="discount"
                  size="small"
                  fullWidth
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  disabled
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
                  onChange={formik.handleChange}
                  disabled={rowData?.roomNumber === formik.values.roomNumber}
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

export default EditReservation;
