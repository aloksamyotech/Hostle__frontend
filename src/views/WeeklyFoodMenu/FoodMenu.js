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
import { FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { weeklyFoodValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const FoodMenu = (props) => {
  const { open, handleClose, hostelId, editFoodItem } = props;

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //When Found editRoom Data
  useEffect(() => {
    if (open && editFoodItem) {
      formik.setValues({
        weekdays: editFoodItem.weekdays || '',
        foodType: editFoodItem.foodType || '',
        foodDescription: editFoodItem.foodDescription || ''
      });
    }
  }, [open, editFoodItem]);

  const formik = useFormik({
    initialValues: {
      weekdays: '',
      foodType: '',
      foodDescription: ''
    },
    validationSchema: weeklyFoodValidationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (editFoodItem) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/weeklyfoodmenu/edit/${editFoodItem._id}`, values);
            if (response.status === 200) {
              toast.success('Food Menu Edit Successfully !!');
            } else {
              console.error('Failed to edit data');
              toast.error('Failed to edit data');
            }
          } catch (error) {
            console.log('Error in editFoodItem', error);
            toast.error('Error in editFoodItem');
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/weeklyfoodmenu/add/${hostelId}`, values);

            if (response.status === 201) {
              toast.success('Food Menu Added Successfully !!');
            } else {
              console.error('Failed to add foodmenu');
              toast.error('Failed to add foodmenu');
            }
          } catch (error) {
            console.log('Error in addFoodItem', error);
            toast.error('Error in addFoodItem');
          }
        }
        handleClose();
        formik.resetForm();
      } catch (error) {
        toast.error('something went wrong !!');
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editFoodItem) {
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
          <Typography variant="h6">Weekly Food Menu</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Weekdays <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <Select id="weekdays" name="weekdays" size="small" fullWidth value={formik.values.weekdays} onChange={formik.handleChange}>
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>
                {formik.touched.weekdays && formik.errors.weekdays ? <FormHelperText error>{formik.errors.weekdays}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Food Type <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <Select id="foodType" name="foodType" size="small" fullWidth value={formik.values.foodType} onChange={formik.handleChange}>
                  <MenuItem value="Breakfast">Breakfast</MenuItem>
                  <MenuItem value="Lunch">Lunch</MenuItem>
                  <MenuItem value="Dinner">Dinner</MenuItem>
                </Select>
                {formik.touched.foodType && formik.errors.foodType ? <FormHelperText error>{formik.errors.foodType}</FormHelperText> : null}
              </Grid>

              <Grid item xs={12}>
                <FormLabel>
                  Food Description <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="foodDescription"
                  name="foodDescription"
                  size="small"
                  multiline
                  fullWidth
                  rows={3}
                  value={formik.values.foodDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.foodDescription && !!formik.errors.foodDescription}
                  helperText={formik.touched.foodDescription && formik.errors.foodDescription}
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

export default FoodMenu;
