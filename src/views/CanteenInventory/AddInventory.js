import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { productValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const AddInventory = (props) => {
  const { open, handleClose, hostelId, editInventory } = props;
  console.log('props==>', props);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //When Found editInventory Data
  useEffect(() => {
    if (open && editInventory) {
      formik.setValues({
        productName: editInventory.productName || '',
        mesurment: editInventory.mesurment || ''
      });
    }
  }, [open, editInventory]);

  const formik = useFormik({
    initialValues: {
      productName: '',
      mesurment: ''
    },
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (editInventory) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/canteen_inventory/edit/${editInventory._id}`, values);

            if (response.status === 200) {
              toast.success('Inventory Updated Successfully !!');
            } else {
              toast.error('Failed to update inventory !!');
            }
          } catch (error) {
            console.log('Error:', error);
            toast.error('Something went wrong !!');
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory/add/${hostelId}`, values);

            if (response.status === 201) {
              toast.success('Inventory Added Successfully !!');
            } else {
              toast.error('Failed to add inventory !!');
            }
          } catch (error) {
            console.log('Error:', error);
            toast.error('Something went wrong !!');
          }
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error:', error);
        toast.error('Something went wrong !!');
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editInventory) {
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
          <Typography variant="h6">Canteen Inventory</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form encType="multipart/form-data">
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Product Name</FormLabel>
                <TextField
                  id="productName"
                  name="productName"
                  size="small"
                  fullWidth
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                  error={formik.touched.productName && !!formik.errors.productName}
                  helperText={formik.touched.productName && formik.errors.productName}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Measurement</FormLabel>
                <Select
                  id="mesurment"
                  name="mesurment"
                  size="small"
                  fullWidth
                  value={formik.values.mesurment}
                  onChange={formik.handleChange}
                  error={formik.touched.mesurment && !!formik.errors.mesurment}
                  helperText={formik.touched.mesurment && formik.errors.mesurment}
                >
                  <MenuItem value="">Select Measurement</MenuItem>
                  <MenuItem value="kg">Kilogram (kg)</MenuItem>
                  <MenuItem value="liter">Liter (L)</MenuItem>
                  <MenuItem value="gm">Gram (gm)</MenuItem>
                </Select>
                {formik.touched.mesurment && formik.errors.mesurment ? (
                  <FormHelperText error>{formik.errors.mesurment}</FormHelperText>
                ) : null}
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

export default AddInventory;
