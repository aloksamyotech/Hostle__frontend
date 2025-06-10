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
import { useNavigate } from 'react-router-dom';


const GenerateBill = (props) => {
  const { open, handleClose, rowData, hostelId } = props;


  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      studentName: rowData?.studentData?.studentName,
      studentContact: rowData?.studentData?.studentContact,
      roomNumber: rowData?.bedData?.roomNumber,
      date: moment(rowData?.date).format('YYYY-MM-DD') || '',
      totalRent: rowData?.totalRent,
      paymentAmount: rowData?.paymentAmount,
      remainingAmount: rowData?.remainingAmount,
      paymentMethod: rowData?.paymentMethod,
      foodFee: rowData?.bedData?.foodFee,
      libraryFee: rowData?.bedData?.libraryFee
    },
    // validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values) => {
 

      try {
        navigate(`/paymentslip/view`);
        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error=>', error);
        toast.error('Something went wrong!');
      }
    }
  });

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
          <Typography variant="h6">Generate Bill for this Payment</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Student Name */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Student Name</FormLabel>
                <TextField fullWidth name="studentName" size="small" value={formik.values.studentName} onChange={formik.handleChange} />
              </Grid>

              {/* Contact Number */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Contact No</FormLabel>
                <TextField
                  fullWidth
                  name="studentContact"
                  size="small"
                  value={formik.values.studentContact}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Room No */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Room No</FormLabel>
                <TextField fullWidth name="roomNumber" size="small" value={formik.values.roomNumber} onChange={formik.handleChange} disabled/>
              </Grid>

              {/* Payment Date */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Payment Date</FormLabel>
                <TextField
                  name="date"
                  type="date"
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

              {/* Total Rent */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Total Rent</FormLabel>
                <TextField name="totalRent" value={formik.values.totalRent} size="small" fullWidth disabled/>
              </Grid>

              {/* Total Rent Paid Amount */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Total Rent Paid</FormLabel>
                <TextField fullWidth name="paymentAmount" size="small" value={formik.values.paymentAmount} onChange={formik.handleChange} disabled/>
              </Grid>

              {/* Pending Amount */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Pending Amount</FormLabel>
                <TextField
                  fullWidth
                  name="remainingAmount"
                  size="small"
                  value={formik.values.remainingAmount}
                  onChange={formik.handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Payment Method</FormLabel>
                <TextField
                  fullWidth
                  select
                  name="paymentMethod"
                  size="small"
                  value={formik.values.paymentMethod || ''}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                </TextField>
              </Grid>

              {/* Food Fee */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Food Fee</FormLabel>
                <TextField fullWidth name="foodFee" size="small" value={formik.values.foodFee} onChange={formik.handleChange} disabled/>
              </Grid>

              {/* Library Fee */}
              <Grid item xs={12} sm={6}>
                <FormLabel>Library Fee</FormLabel>
                <TextField fullWidth name="libraryFee" size="small" value={formik.values.libraryFee} onChange={formik.handleChange} disabled />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            Generate Bill
          </Button>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GenerateBill;
