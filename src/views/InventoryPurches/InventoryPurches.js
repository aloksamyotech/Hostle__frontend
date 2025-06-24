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
import { FormControl, FormHelperText, FormLabel, Select, MenuItem } from '@mui/material';
import { productPurchesValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { handleApiResponse } from 'utils/common';

const PurchaseInventory = (props) => {
  const { open, handleClose, hostelId, editPurchase } = props;

  const [allProductList, setProductList] = useState([]);
  const [existingImgFile, setExistingImgFile] = useState(null);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (open && editPurchase) {
      const formattedDate = moment(editPurchase.date).format('YYYY-MM-DD');
      formik.setValues({
        productName: editPurchase.productName || '',
        quantity: editPurchase.quantity || '',
        price: editPurchase.price || '',
        date: formattedDate || ''
      });
    }
  }, [open, editPurchase]);

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const response = await axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory/index/${hostelId}`);
          const res = await handleApiResponse(response);
          const ProductNames = res?.data.map((product) => product['productName']);
          setProductList(ProductNames);
        } catch (error) {
          console.log('Product List is not Found!!', error);
        }
      })();
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      productName: '',
      quantity: '',
      price: '',
      date: '',
      purchesBillPhoto: null
    },
    validationSchema: productPurchesValidationSchema,
    // onSubmit: async (values) => {
    //   try {
    //     let response;
    //     if (editPurchase) {
    //       try {
    //         response = await axios.put(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/edit/${editPurchase._id}`, values);
    //         await handleApiResponse(response, 'UPDATE');
    //       } catch (error) {
    //         console.log('Error:', error);
    //         toast.error('Something went wrong !!');
    //       }
    //     } else {
    //       try {
    //         response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/add/${hostelId}`, values);
    //         await handleApiResponse(response);
    //       } catch (error) {
    //         console.log('Error:', error);
    //         toast.error('Something went wrong !!');
    //       }
    //     }

    //     handleClose();
    //     formik.resetForm();
    //   } catch (error) {
    //     console.log('Error:', error);
    //     toast.error('Something went wrong !!');
    //   }
    // }

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('productName', values.productName);
        formData.append('quantity', values.quantity);
        formData.append('price', values.price);
        formData.append('date', values.date);
        if (values.purchesBillPhoto) {
          formData.append('purchesBillPhoto', values.purchesBillPhoto);
        }

        let response;
        if (editPurchase) {
          response = await axios.put(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/edit/${editPurchase._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          await handleApiResponse(response, 'UPDATE');
        } else {
          response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/add/${hostelId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          await handleApiResponse(response);
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error:', error);
        toast.error('Something went wrong !!');
      }
    }
  });

  useEffect(() => {
    if (open && !editPurchase) {
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (open && editPurchase) {
      const fullPath = editPurchase.purchesBillPhoto || null;
      const fileName = fullPath ? fullPath.replace('/images/', '') : null;
      setExistingImgFile(fileName);
    }
  }, [open, editPurchase]);

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
          <Typography variant="h6">Inventory Purchase</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Product List <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <Select
                  id="productName"
                  name="productName"
                  size="small"
                  fullWidth
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {allProductList.map((product) => (
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
                <FormLabel>
                  Quantity <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
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
                <FormLabel>
                  Price <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="price"
                  name="price"
                  type="number"
                  size="small"
                  fullWidth
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && !!formik.errors.price}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Date & Time <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
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

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Attach Bill Photo / Payment Screenshot</FormLabel>

                <input
                  type="file"
                  name="purchesBillPhoto"
                  onChange={(event) => {
                    formik.setFieldValue('purchesBillPhoto', event.currentTarget.files[0]);
                  }}
                />
                {existingImgFile && !formik.values.purchesBillPhoto && <Typography>Current file: {existingImgFile}</Typography>}
                {formik.values.purchesBillPhoto && formik.values.purchesBillPhoto.name && (
                  <Typography>Selected file: {formik.values.purchesBillPhoto.name}</Typography>
                )}
                {formik.touched.purchesBillPhoto && formik.errors.purchesBillPhoto && (
                  <FormHelperText error>{formik.errors.purchesBillPhoto}</FormHelperText>
                )}
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
export default PurchaseInventory;
