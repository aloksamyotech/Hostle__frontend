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
import moment from 'moment';

const EditStudent = (props) => {
  const { open, handleClose, profileData } = props;
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [studentPhotoPreview, setstudentPhotoPreview] = useState('');
  const [aadharPhotoPreview, setaadharPhotoPreview] = useState('');

  const formik = useFormik({
    initialValues: {
      studentName: profileData?.studentId?.studentName || '',
      studentContact: profileData?.studentId?.studentContact || '',
      fatherName: profileData?.studentId?.fatherName || '',
      fatherContact: profileData?.studentId?.fatherContact || '',
      guardianName: profileData?.studentId?.guardianName || '',
      guardianContactNo: profileData?.studentId?.guardianContactNo || '',
      guardiansAddress: profileData?.studentId?.guardiansAddress || '',
      dob: moment(profileData?.studentId?.dob).format('YYYY-MM-DD') || '',
      gender: profileData?.studentId?.gender || '',
      mailId: profileData?.studentId?.mailId || '',
      courseOccupation: profileData?.studentId?.courseOccupation || '',
      address: profileData?.studentId?.address || '',
      studentPhoto: '',
      aadharPhoto: ''
    },

    // validationSchema: addReservedBedValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('this is student data ------------------>', values);

      const formData = new FormData();
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
        const response = await axios.put(`${REACT_APP_BACKEND_URL}/sudent_reservation/edit/${profileData?.studentId?._id}`, formData);

        if (response.status === 200) {
          toast.success('Student details updated successfully !!');
        } else {
          toast.error('Failed to update Student details !!');
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error=>', error);
        toast.error('Something went wrong !!');
      }
    }
  });

  useEffect(() => {
    if (open && profileData) {
      if (profileData.studentId.studentPhoto && !studentPhotoPreview) {
        setstudentPhotoPreview(`${REACT_APP_BACKEND_URL}${profileData.studentId.studentPhoto}`);
      }
      if (profileData.studentId.aadharPhoto && !aadharPhotoPreview) {
        setaadharPhotoPreview(`${REACT_APP_BACKEND_URL}${profileData.studentId.aadharPhoto}`);
      }
    }
  }, [open, profileData]);

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
          <Typography variant="h6">Update Student Details</Typography>
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
              {/* Student Information Title */}

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
                <TextField
                  id="studentPhoto"
                  name="studentPhoto"
                  type="file"
                  size="small"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue('studentPhoto', file);
                    setstudentPhotoPreview(URL.createObjectURL(file));
                  }}
                />
                {studentPhotoPreview && (
                  <img src={studentPhotoPreview} alt="Student Preview" style={{ marginTop: 8, maxHeight: 80, display: 'block' }} />
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Upload AadharCard Photo</FormLabel>
                <TextField
                  id="aadharPhoto"
                  name="aadharPhoto"
                  type="file"
                  size="small"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue('aadharPhoto', file);
                    setaadharPhotoPreview(URL.createObjectURL(file));
                  }}
                />
                {aadharPhotoPreview && (
                  <img src={aadharPhotoPreview} alt="Aadhar Preview" style={{ marginTop: 8, maxHeight: 80, display: 'block' }} />
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

export default EditStudent;
