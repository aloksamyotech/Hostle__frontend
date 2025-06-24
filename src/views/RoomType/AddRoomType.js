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
import { roomTypeValidationSchema } from 'views/Validation/validationSchema';
import { reset } from 'numeral';
import { handleApiResponse } from 'utils/common';

const AddRoomType = (props) => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const { open, handleClose, hostelId, rowData } = props;

  const formik = useFormik({
    initialValues: {
      roomType: rowData?.roomType || '',
      roomCategory: rowData?.roomCategory || ''
    },
    validationSchema: roomTypeValidationSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        let response;
        if (rowData) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/roomTypes/update/${rowData._id}`, values);
            const res = await handleApiResponse(response, 'UPDATE');
          } catch (error) {
            console.log('Error:', error);
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/roomTypes/add/${hostelId}`, values);
            const res = await handleApiResponse(response);
          } catch (error) {
            console.log('Error:', error);
            toast.error('Something went wrong !!');
          }
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error=>', error);
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
          <Typography variant="h6">Add New Room Type</Typography>
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
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Room Type <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>

                <TextField
                  id="roomType"
                  name="roomType"
                  size="small"
                  fullWidth
                  value={formik.values.roomType}
                  onChange={formik.handleChange}
                  error={formik.touched.roomType && !!formik.errors.roomType}
                  helperText={formik.touched.roomType && formik.errors.roomType}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Room Category <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <Select
                  id="roomCategory"
                  name="roomCategory"
                  size="small"
                  fullWidth
                  value={formik.values.roomCategory}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="AC">AC</MenuItem>
                  <MenuItem value="Non-AC">Non-AC</MenuItem>
                </Select>
                {formik.touched.roomCategory && formik.errors.roomCategory && (
                  <FormHelperText error>{formik.errors.roomCategory}</FormHelperText>
                )}
              </Grid>
            </Grid>

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
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoomType;
