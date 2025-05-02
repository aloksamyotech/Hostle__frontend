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
import { ToastContainer, toast } from 'react-toastify';

const AddComplaint = (props) => {
  const { open, handleClose, hostelId, editComplaint } = props;
  console.log(' AddComplaint props====>', props);

  const [studentList, setStudentList] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const fetchStudents = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
      const activeStudents = response.data.result.filter((item) => item.status === 'active');
      setStudentList(activeStudents);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  useEffect(() => {
    fetchStudents(hostelId);
  }, [open]);

  const formik = useFormik({
    initialValues: {
      studentId: editComplaint?.studentId || '',
      datetime: moment(editComplaint?.datetime).format('YYYY-MM-DD') || '',
      problemDescription: editComplaint?.problemDescription || '',
      status: editComplaint?.status || ''
    },
    enableReinitialize: true,
    validationSchema: studentComplaintValidationSchema,
    onSubmit: async (values) => {
      console.log('Hyyyyyyy Form values:====>', values);

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
          response = await axios.post(`${REACT_APP_BACKEND_URL}/student_complaint/add/${hostelId}`, values, {
            headers: {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`
            }
          });
        }

        if (response.status === 201) {
          console.log('Complaint Add Successfully !!');
          toast.success('Complaint Add Successfully !!');
        } else {
          console.error('Failed to save data');
          toast.success('Something went wrong while add complaint !!');
        }

        handleClose();
      } catch (error) {
        console.log('Error Found', error);
        toast.success('Something went wrong !!');
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
                <FormLabel>Select Student</FormLabel>
                <Select name="studentId" value={formik.values.studentId} onChange={formik.handleChange} size="small" fullWidth>
                  {studentList.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.studentName}
                    </MenuItem>
                  ))}
                </Select>
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
