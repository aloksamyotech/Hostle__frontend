import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { FormLabel, InputAdornment, IconButton, List, ListItem, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { visitorValidationSchema } from 'views/Validation/validationSchema';
import { toast } from 'react-toastify';

const AddVisotor = (props) => {
  const { open, handleClose, hostelId } = props;
  console.log('props===>', props);

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
      studentId: '',
      visitorName: '',
      phoneNumber: '',
      dateTime: '',
      visitorduration: ''
    },
    validationSchema: visitorValidationSchema,
    onSubmit: async (values) => {
      console.log('Form values:==>', values);

      try {
        let response;
        response = await axios.post(`${REACT_APP_BACKEND_URL}/visitor/add/${hostelId}`, values);

        if (response.status === 201) {
          toast.success('visitor addes successfully!!');
        } else {
          toast.success('something went wront while added visitor');
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error:', error);
        toast.error('Something went wrong !!');
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
          <Typography variant="h6">Visitor Basic Information</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
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
                <FormLabel>Visitor Name</FormLabel>
                <TextField
                  id="visitorName"
                  name="visitorName"
                  size="small"
                  fullWidth
                  value={formik.values.visitorName}
                  onChange={formik.handleChange}
                  error={formik.touched.visitorName && !!formik.errors.visitorName}
                  helperText={formik.touched.visitorName && formik.errors.visitorName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Contact No</FormLabel>
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
                <FormLabel>Date & Time</FormLabel>
                <TextField
                  id="dateTime"
                  name="dateTime"
                  size="small"
                  type="date"
                  fullWidth
                  value={formik.values.dateTime}
                  onChange={formik.handleChange}
                  error={formik.touched.dateTime && !!formik.errors.dateTime}
                  helperText={formik.touched.dateTime && formik.errors.dateTime}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Visit Duration</FormLabel>
                <TextField
                  id="visitorduration"
                  name="visitorduration"
                  size="small"
                  fullWidth
                  value={formik.values.visitorduration}
                  onChange={formik.handleChange}
                  error={formik.touched.visitorduration && !!formik.errors.visitorduration}
                  helperText={formik.touched.visitorduration && formik.errors.visitorduration}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            {' '}
            Save{' '}
          </Button>
          <Button onClick={handleClose} variant="outlined" color="error">
            {' '}
            Cancel{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddVisotor;
