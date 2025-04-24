import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, FormLabel,
  Grid, MenuItem, TextField, Typography, InputAdornment, IconButton, List, ListItem
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { paymentValidationSchema } from 'views/Validation/validationSchema';

const AddPayment = ({ open, handleClose, hostelId }) => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');

  useEffect(() => {
    if (open) {
      console.log("URL =>",`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
      axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`)
        .then(response => {
          console.log("in hook =>",response);
          const studentData = response.data.result.map(student => ({
            studentName : student.studentName, 
            studentPhoneNo: student.studentPhoneNo,
          }));
          setStudentList(studentData);
        })
        .catch(error => {
          console.log("Error fetching student data", error);
        });
    }
  }, [open, hostelId]);
  console.log("studentList==>",studentList);

  useEffect(() => {
    console.log("Filtering students with phone number input:", inputValue);
    if (inputValue) {
      const filteredStudents = studentList.filter(student => {
        const phoneNo = student.studentPhoneNo?.toString();
        return phoneNo.includes(inputValue);
      });
      console.log("Filtered students:", filteredStudents);
      setFilteredStudentList(filteredStudents);
    } else {
      setFilteredStudentList([]);
    }
  }, [inputValue, studentList]);

  const handleStudentSelect = (name) => {
    setSelectedStudentName(name);
    setInputValue(name);
    setFilteredStudentList([]);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setSelectedStudentName('');
  };

  const formik = useFormik({
    initialValues: {
      studentName: '',
      month: '',
      paymentDate: '',
      paymentType: '',
      paymentAmount: '',
      paymentAttachment: '',
    },
    validationSchema: paymentValidationSchema,

    onSubmit: async (values) => {
      console.log("values========>",values);

      const formData = new FormData();
      formData.append('studentName', selectedStudentName); 

      Object.keys(values).forEach(key => {
        if (key !== 'studentName') {
          formData.append(key, values[key]);
        }
      });

      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/student_payment/add/${hostelId}`, formData);
        if (response.status === 201 || response.status === 200) {
          console.log("Payment added successfully!");
          handleClose();
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log("Error while submitting the form", error);
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="add-payment-dialog-title">
      <DialogTitle id="add-payment-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Add Payment</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <FormLabel>Student Name</FormLabel>
              <TextField
                id="studentName"
                name="studentName"
                size="small"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setInputValue('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={formik.touched.studentName && !!formik.errors.studentName}
                helperText={formik.touched.studentName && formik.errors.studentName}
              />
              {filteredStudentList.length > 0 && (
                <List style={{ border: '1px solid #ddd', marginTop: 4 }}>
                  {filteredStudentList.map(student => (
                    <ListItem
                      key={student.studentPhoneNo}
                      onClick={() => handleStudentSelect(student.studentName)}
                    >
                      {student.studentName}
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>Month</FormLabel>
              <TextField
                id="month"
                name="month"
                size="small"
                select
                fullWidth
                value={formik.values.month}
                onChange={formik.handleChange}
                error={formik.touched.month && !!formik.errors.month}
              >
                <MenuItem value=""><em>Select Month</em></MenuItem>
                <MenuItem value="January">January</MenuItem>
                <MenuItem value="February">February</MenuItem>
                <MenuItem value="March">March</MenuItem>
                <MenuItem value="April">April</MenuItem>
                <MenuItem value="May">May</MenuItem>
                <MenuItem value="June">June</MenuItem>
                <MenuItem value="July">July</MenuItem>
                <MenuItem value="August">August</MenuItem>
                <MenuItem value="September">September</MenuItem>
                <MenuItem value="October">October</MenuItem>
                <MenuItem value="November">November</MenuItem>
                <MenuItem value="December">December</MenuItem>
              </TextField>
              {formik.touched.month && formik.errors.month && (
                <FormHelperText error>{formik.errors.month}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Date</FormLabel>
              <TextField
                id="paymentDate"
                name="paymentDate"
                size="small"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formik.values.paymentDate}
                onChange={formik.handleChange}
                error={formik.touched.paymentDate && !!formik.errors.paymentDate}
                helperText={formik.touched.paymentDate && formik.errors.paymentDate}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Payment Method</FormLabel>
              <TextField
                id="paymentType"
                name="paymentType"
                size="small"
                select
                fullWidth
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                error={formik.touched.paymentType && !!formik.errors.paymentType}
              >
                <MenuItem value=""><em>Select Payment Method</em></MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online Payment">Online Payment</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </TextField>
              {formik.touched.paymentType && formik.errors.paymentType && (
                <FormHelperText error>{formik.errors.paymentType}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Payment Amount</FormLabel>
              <TextField
                id="paymentAmount"
                name="paymentAmount"
                size="small"
                type="number"
                fullWidth
                value={formik.values.paymentAmount}
                onChange={formik.handleChange}
                error={formik.touched.paymentAmount && !!formik.errors.paymentAmount}
                helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Payment Attachment (optional)</FormLabel>
              <TextField
                id="paymentAttachment"
                name="paymentAttachment"
                type="file"
                size="small"
                fullWidth
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue('paymentAttachment', file); // Set the file
                }}
              />
              {formik.touched.paymentAttachment && formik.errors.paymentAttachment && (
                <FormHelperText error>{formik.errors.paymentAttachment}</FormHelperText>
              )}
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayment;


