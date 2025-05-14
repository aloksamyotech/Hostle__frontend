import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { paymentValidationSchema } from 'views/Validation/validationSchema';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const AddPayment = (props) => {
  const { open, handleClose } = props;

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [studentList, setStudentList] = useState([]);
  const [paymentdata, setPaymentData] = useState();
  const [hostelId, setHostelId] = useState(null);
  const [remainingAmt, setRemainingAmt] = useState();

  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  console.log('id student payment payment -------->', id);

  const fetchStudents = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
      const activeStudents = response.data.result.filter((item) => item.status === 'active' && item.paymentStatus === 'pending');
      setStudentList(activeStudents);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handleStudentChange = async (studentId) => {
    formik.setFieldValue('studentId', studentId);

    try {
      const res1 = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/getStudent/${studentId}`);
      const assignedData = res1.data.data;

      const res2 = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/getRemaningData/${studentId}`);

      const paymentData = res2.data?.result;

      setPaymentData(paymentData);
     

      const totalRent = assignedData?.finalTotalRent || 0;
      const remainingAmount = paymentData != null ? paymentData.remainingAmount : totalRent;
      setRemainingAmt(remainingAmount);

      formik.setValues({
        ...formik.values,
        studentId,
        totalStayingMonth: assignedData?.stayMonths || '',
        roomNo: assignedData?.roomNumber || '',
        roomType: assignedData?.roomType || '',
        bedNo: assignedData?.bedNumber || '',
        roomRent: assignedData?.roomRent || '',
        foodFee: assignedData?.foodFee || '',
        libraryFee: assignedData?.libraryFee || '',
        totalRent: assignedData?.totalRent || '',
        advanceAmount: assignedData?.advanceAmount || '',
        discount: assignedData?.discount || '',
        finalTotalRent: assignedData?.finalTotalRent || '',
        remainingAmount: remainingAmount
      });
    } catch (error) {
      console.error('Error fetching student/payment data:', error);
    }
  };

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    if (id) {
      formik.setFieldValue('studentId', id);
      handleStudentChange(id);
      fetchStudents(Hos_Id);
    } 
    // else {
    //   fetchStudents(Hos_Id);
    // }

    
  }, [open]);

  const formik = useFormik({
    initialValues: {
      studentId: '',
      totalStayingMonth: '',
      roomNo: '',
      roomType: '',
      bedNo: '',
      roomRent: '',
      foodFee: '',
      libraryFee: '',
      totalRent: '',
      advanceAmount: '',
      discount: '',
      finalTotalRent: '',
      remainingAmount: '',
      paymentMethod: '',
      date: '',
      paymentAmount: ''
    },
    validationSchema: paymentValidationSchema(remainingAmt),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/student_payment/add/${hostelId}`, values);

        if (response.status === 201) {
          toast.success('Payment Details Added Successfully !!');
        } else {
          toast.error('Failed to Add Payment Details');
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error=>', error);
        toast.error('Something went wrong!');
      }
    }
  });

  useEffect(() => {
    const total = paymentdata?.remainingAmount ?? (parseFloat(formik.values.finalTotalRent) || 0);
    const paid = parseFloat(formik.values.paymentAmount) || 0;
    const remaining = total - paid;

    formik.setFieldValue('remainingAmount', remaining);
  

  }, [formik.values.paymentAmount]);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="add-payment-dialog-title">
      <DialogTitle id="add-payment-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Add Payment</Typography>
        <ClearIcon
          onClick={() => {
            handleClose();
            formik.resetForm();
          }}
          style={{ cursor: 'pointer' }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Select Student */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Select Student</FormLabel>
              <Select
                name="studentId"
                value={formik.values.studentId}
                onChange={(e) => handleStudentChange(e.target.value)}
                size="small"
                fullWidth
              >
               
                
                {studentList.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.studentName}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Total Staying Month</FormLabel>
              <TextField name="totalStayingMonth" value={formik.values.totalStayingMonth} size="small" fullWidth disabled />
            </Grid>

            {/* Room Number */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Room Number</FormLabel>
              <TextField name="roomNo" value={formik.values.roomNo} size="small" fullWidth disabled />
            </Grid>

            {/* Room Type */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Room Type</FormLabel>
              <TextField name="roomType" value={formik.values.roomType} size="small" fullWidth disabled />
            </Grid>

            {/* Bed Number */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Bed Number</FormLabel>
              <TextField name="bedNo" value={formik.values.bedNo} size="small" fullWidth disabled />
            </Grid>

            {/* Room Rent */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Room Rent</FormLabel>
              <TextField name="roomRent" value={formik.values.roomRent} size="small" fullWidth disabled />
            </Grid>

            {/* Food Fee */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Food Fee</FormLabel>
              <TextField name="foodFee" value={formik.values.foodFee} size="small" fullWidth disabled />
            </Grid>

            {/* Library Fee */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Library Fee</FormLabel>
              <TextField name="libraryFee" value={formik.values.libraryFee} size="small" fullWidth disabled />
            </Grid>

            {/* Total Rent */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Total Rent</FormLabel>
              <TextField name="totalRent" value={formik.values.totalRent} size="small" fullWidth disabled />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Advance Amount</FormLabel>
              <TextField name="advanceAmount" value={formik.values.advanceAmount} size="small" fullWidth disabled />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Discount</FormLabel>
              <TextField name="discount" value={formik.values.discount} size="small" fullWidth disabled />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Final Amount</FormLabel>
              <TextField name="finalTotalRent" value={formik.values.finalTotalRent} size="small" fullWidth disabled />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Remaining Amount</FormLabel>
              <TextField type="number" name="remainingAmount" value={formik.values.remainingAmount} size="small" fullWidth disabled />
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Payment Method</FormLabel>
              <FormControl size="small" fullWidth required>
                <Select name="paymentMethod" value={formik.values.paymentMethod} onChange={formik.handleChange}>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Select Month */}
            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Date</FormLabel>
              <TextField
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormLabel>Payment Amount</FormLabel>
              <TextField
                type="number"
                name="paymentAmount"
                value={formik.values.paymentAmount}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                required
                inputProps={{ min: 0 }}
                error={formik.touched.paymentAmount && !!formik.errors.paymentAmount}
                helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button
              onClick={() => {
                handleClose();
                formik.resetForm();
              }}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddPayment;
