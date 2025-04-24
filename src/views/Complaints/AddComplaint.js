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
import { useFormik } from 'formik';
import { FormControl, FormHelperText, FormLabel, Select, MenuItem, InputAdornment, IconButton, List, ListItem } from '@mui/material';
import { studentComplaintValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';

const AddComplaint = (props) => {
  const { open, handleClose, hostelId, editComplaint } = props;
  console.log('props====>', props);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);

  const [inputValue, setInputValue] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [selectedStudentPhoneNo, setSelectedStudentPhoneNo] = useState('');

  //For Student Name and Contact No Array
  useEffect(() => {
    if (open) {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
      axios
        .get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`)
        .then((response) => {
          console.log('in hook =>', response);
          const studentData = response.data.result
            .filter((student) => student.status !== 'deactive')
            .map((student) => ({
              studentName: student.studentName,
              studentPhoneNo: student.studentPhoneNo
            }));
          setStudentList(studentData);
        })
        .catch((error) => {
          console.log('Error fetching student data', error);
        });
    }
  }, [open, hostelId]);
  console.log('studentList  ==>', studentList);

  useEffect(() => {
    console.log('Filtering students with phone number input:', inputValue);
    if (inputValue) {
      console.log('inputValue======>', inputValue);
      const filteredStudents = studentList.filter((student) => {
        const phoneNo = student.studentPhoneNo?.toString();
        return phoneNo.includes(inputValue);
      });
      console.log('Filtered students:', filteredStudents);
      setFilteredStudentList(filteredStudents);
    } else {
      setFilteredStudentList([]);
    }
  }, [inputValue, studentList]);

  // Reset fields when dialog is closed
  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setInputValue('');
      setSelectedStudentName('');
      setSelectedStudentPhoneNo('');
    }
  }, [open]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setSelectedStudentName('');
    setSelectedStudentPhoneNo('');
  };

  const handleStudentSelect = (name, phoneNo) => {
    setSelectedStudentName(name);
    setSelectedStudentPhoneNo(phoneNo);
    setInputValue(name);
    formik.setFieldValue('studentName', name);
    formik.setFieldValue('studentPhoneNo', phoneNo);
    setFilteredStudentList([]);
  };

  //When Found editRoom Data
  useEffect(() => {
    if (open && editComplaint) {
      const formattedDate = moment(editComplaint.datetime).format('YYYY-MM-DD');
      formik.setValues({
        studentName: editComplaint.studentName || '',
        datetime: formattedDate || '',
        problemDescription: editComplaint.problemDescription || '',
        status: editComplaint.status || ''
      });

      setInputValue(editComplaint.studentName || '');
    }
  }, [open, editComplaint]);

  const formik = useFormik({
    initialValues: {
      studentName: editComplaint ? editComplaint.studentName : selectedStudentName || '',
      // studentPhoneNo: editComplaint ? editComplaint.studentPhoneNo : selectedStudentPhoneNo || '',
      datetime: editComplaint ? moment(editComplaint.datetime).format('YYYY-MM-DD') : '',
      problemDescription: editComplaint ? editComplaint.problemDescription : '',
      status: editComplaint ? editComplaint.status : ''
    },
    validationSchema: studentComplaintValidationSchema,
    onSubmit: async (values) => {
      // Handle form submission here
      console.log('Form values:====>', values);

      try {
        let response;
        if (editComplaint) {
          console.log('URL=>', `${REACT_APP_BACKEND_URL}/student_complaint/edit/${editComplaint._id}`);
          response = await axios.put(`${REACT_APP_BACKEND_URL}/student_complaint/edit/${editComplaint._id}`, values, {
            headers: {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`
            }
          });
        } else {
          console.log('URL=>', `${REACT_APP_BACKEND_URL}/student_complaint/add/${hostelId}`);
          response = await axios.post(`${REACT_APP_BACKEND_URL}/student_complaint/add/${hostelId}`, values, {
            headers: {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`
            }
          });
        }
        console.log('response==>', response);

        if (response.status === 201 || response.status === 200) {
          console.log('Complaint Add Successfully !!');
          handleClose();
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log('Error Found', error);
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
          <Typography variant="h6">Student Complaint</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Students List</FormLabel>
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
                    )
                  }}
                  error={formik.touched.studentName && !!formik.errors.studentName}
                  helperText={formik.touched.studentName && formik.errors.studentName}
                />
                {filteredStudentList.length > 0 && (
                  <List style={{ border: '1px solid #ddd', marginTop: 4 }}>
                    {filteredStudentList.map((student) => (
                      <ListItem
                        key={student.studentPhoneNo}
                        onClick={() => handleStudentSelect(student.studentName, student.studentPhoneNo)}
                        style={{ cursor: 'pointer' }}
                      >
                        {student.studentName} - {student.studentPhoneNo}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Date and Time</FormLabel>
                <TextField
                  id="datetime"
                  name="datetime"
                  type="date"
                  size="small"
                  fullWidth
                  value={formik.values.datetime}
                  onChange={formik.handleChange}
                  error={formik.touched.datetime && !!formik.errors.datetime}
                  helperText={formik.touched.datetime && formik.errors.datetime}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Status</FormLabel>
                <Select
                  id="status"
                  name="status"
                  size="small"
                  fullWidth
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && !!formik.errors.status}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="register">Register</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status ? <FormHelperText error>{formik.errors.status}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Problem Description</FormLabel>
                <TextField
                  id="problemDescription"
                  name="problemDescription"
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.problemDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.problemDescription && !!formik.errors.problemDescription}
                  helperText={formik.touched.problemDescription && formik.errors.problemDescription}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" onClick={formik.handleSubmit} style={{ textTransform: 'capitalize' }} color="secondary">
            Save
          </Button>
          <Button
            type="reset"
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddComplaint;
