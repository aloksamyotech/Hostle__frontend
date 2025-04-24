import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { roomValidationSchema } from 'views/Validation/validationSchema';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const AddRoom = (props) => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const { open, handleClose, hostelId, editRoom } = props;

  console.log('props===>', props);

  const formik = useFormik({
    initialValues: {
      roomNumber: '',
      roomType: '',
      roomphoto: ''
    },
    validationSchema: roomValidationSchema,

    onSubmit: async (values) => {
      console.log('Form values ======>', values);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === 'roomphoto') {
          for (let i = 0; i < values.roomphoto.length; i++) {
            formData.append('roomphoto', values.roomphoto[i]);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      // Log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(`formData=======> ${key}: ${value}`);
      }

      try {
        let response;
        if (editRoom) {
          response = await axios.put(`${REACT_APP_BACKEND_URL}/room/edit/${editRoom._id}`, formData, {
            headers: {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          response = await axios.post(`${REACT_APP_BACKEND_URL}/room/add/${hostelId}`, formData, {
            headers: {
              Authorization: `Bearer ${Cookies.get('Admin_Token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        console.log('response====>', response);

        if (response.status === 201 || response.status === 200) {
          console.log('Room Details Added Successfully !!');
          handleClose();
          toast.success('Room added successfully !!');
        } else {
          toast.error('Can not add room !!');
          console.error('Failed to save data');
        }
      } catch (error) {
        console.log('Error=>', error);
      }
    }
  });

  useEffect(() => {
    if (open && editRoom) {
      formik.setValues({
        roomNumber: editRoom?.roomNumber || '',
        roomType: editRoom?.roomType || '',
        roomphoto: editRoom?.roomphoto || [],
      });
    }
  }, [open, editRoom]);

  useEffect(() => {
    if (open && !editRoom) {
      formik.resetForm();
    }
  }, [open]);

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
          <Typography variant="h6">Room Basic Details</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Number</FormLabel>
                <TextField
                  id="roomNumber"
                  name="roomNumber"
                  size="small"
                  fullWidth
                  value={formik.values.roomNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.roomNumber && !!formik.errors.roomNumber}
                  helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Type</FormLabel>
                <Select id="roomType" name="roomType" size="small" fullWidth value={formik.values.roomType} onChange={formik.handleChange}>
                  <MenuItem value="">Select Room Type</MenuItem>
                  <MenuItem value="Single Seater">Single Seater</MenuItem>
                  <MenuItem value="Double Seater">Double Seater</MenuItem>
                  <MenuItem value="Three Seater">Three Seater</MenuItem>
                </Select>
                {formik.touched.roomType && formik.errors.roomType ? <FormHelperText error>{formik.errors.roomType}</FormHelperText> : null}
              </Grid>

              {/* <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Total No. of Beds</FormLabel>
                <Select
                  id="numOfBeds"
                  name="numOfBeds"
                  size="small"
                  fullWidth
                  value={formik.values.numOfBeds}
                  onChange={formik.handleChange}
                  error={formik.touched.numOfBeds && !!formik.errors.numOfBeds}
                  helperText={formik.touched.numOfBeds && formik.errors.numOfBeds}
                >
                  <MenuItem value="">Select Number of Beds</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
                {formik.touched.numOfBeds && formik.errors.numOfBeds ? (
                  <FormHelperText error>{formik.errors.numOfBeds}</FormHelperText>
                ) : null}
              </Grid> */}

              {/* <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Occupied Beds</FormLabel>
                <TextField
                  id="occupiedBeds"
                  name="occupiedBeds"
                  size="small"
                  fullWidth
                  value={formik.values.occupiedBeds}
                  onChange={formik.handleChange}
                  error={formik.touched.occupiedBeds && !!formik.errors.occupiedBeds}
                  helperText={formik.touched.occupiedBeds && formik.errors.occupiedBeds}
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Rent</FormLabel>
                <TextField
                  id="roomRent"
                  name="roomRent"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.roomRent}
                  onChange={formik.handleChange}
                  error={formik.touched.roomRent && !!formik.errors.roomRent}
                  helperText={formik.touched.roomRent && formik.errors.roomRent}
                />
              </Grid> */}

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Select Multiple Room Photo</FormLabel>
                <input
                  id="roomphoto"
                  name="roomphoto"
                  type="file"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files);
                    formik.setFieldValue('roomphoto', files); // Set the field value to an array of files
                  }}
                />
                {/* Show existing image file names if present */}
                {Array.isArray(editRoom?.roomphoto) && editRoom.roomphoto.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <Typography variant="body2" fontWeight="bold">
                      Existing Photos:
                    </Typography>
                    {editRoom.roomphoto.map((fileName, index) => (
                      <Typography key={index} variant="body2">
                        {fileName}
                      </Typography>
                    ))}
                  </div>
                )}
                {formik.touched.roomphoto && formik.errors.roomphoto && <FormHelperText error>{formik.errors.roomphoto}</FormHelperText>}
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button
                onClick={() => {
                  handleClose();
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
    </div>
  );
};

export default AddRoom;
