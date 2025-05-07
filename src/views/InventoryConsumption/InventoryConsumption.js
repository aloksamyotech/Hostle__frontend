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
import { FormControl, FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { productConsumeValidationSchema } from 'views/Validation/validationSchema';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

const ConsumptionInventory = (props) => {
  const { open, handleClose, hostelId, editConsumeProduct } = props;
  console.log('props==>', props);

  const [allPurchaseProducts, setAllPurchaseProducts] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //When Found editConsumeProduct Data
  useEffect(() => {
    if (open && editConsumeProduct) {
      const formattedDate = moment(editConsumeProduct.date).format('YYYY-MM-DD');
      formik.setValues({
        productName: editConsumeProduct.productName || '',
        quantity: editConsumeProduct.quantity || '',
        date: formattedDate || ''
      });
    }
  }, [open, editConsumeProduct]);

  //Get All Purchased Product Which Added
  useEffect(() => {
    if (open) {
      axios
        .get(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/index/${hostelId}`)
        .then((response) => {
          console.log('Purchase Products ==>', response);

          const ProductNames = response.data.result.map((product) => product['productName']);
          console.log('==>', ProductNames);
          setAllPurchaseProducts(ProductNames);
        })
        .catch((error) => {
          console.log('Product List is not Found!!', error);
        });
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      productName: '',
      quantity: '',
      date: ''
    },
    validationSchema: productConsumeValidationSchema,
    onSubmit: async (values) => {
      console.log('Form is valid ====>', values);

      try {
        let response;
        if (editConsumeProduct) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/canteen_inventory_consume/edit/${editConsumeProduct._id}`, values);

            if (response.status === 200) {
              toast.success('Inventory Consume Updated Successfully !!');
            } else {
              if (response.status === 205) {
                toast.error('Insufficient Consume Quantity');
                console.log('Consume quantity cannot be greater than remaining or purchase quantity.');
              } else {
                toast.error('Failed to update Inventory Consume !!');
              }
            }
          } catch (error) {
            console.log('Found Error', error);
            toast.error('Error in Edit Consume Product');
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory_consume/add/${hostelId}`, values);
            console.log('response ====>', response);
            if (response.status === 201) {
              toast.success('Inventory Consume Added Successfully !!');
            } else {
              if (response.status === 205) {
                toast.error('Insufficient Consume Quantity');
                console.log('Consume quantity cannot be greater than remaining or purchase quantity.');
              } else {
                toast.error('Failed to Add Inventory Consume !!');
              }
            }
          } catch (error) {
            console.log('Found Error', error);
            toast.error('Error in Add Consume Product');
          }
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Found Error', error);
        toast.error('Error in Add Consume Product');
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editConsumeProduct) {
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
          <Typography variant="h6">Inventory Consumption</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Product List</FormLabel>
                <Select
                  id="productName"
                  name="productName"
                  size="small"
                  fullWidth
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {allPurchaseProducts.map((product) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.productName && formik.errors.productName ? (
                  <FormHelperText error>{formik.errors.productName}</FormHelperText>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Quantity</FormLabel>
                <TextField
                  id="quantity"
                  name="quantity"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  error={formik.touched.quantity && !!formik.errors.quantity}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Date & Time</FormLabel>
                <TextField
                  id="date"
                  name="date"
                  size="small"
                  type="date"
                  fullWidth
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && !!formik.errors.date}
                  helperText={formik.touched.date && formik.errors.date}
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

export default ConsumptionInventory;
