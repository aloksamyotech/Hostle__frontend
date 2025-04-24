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
import { FormControl, FormHelperText, FormLabel, Select,MenuItem } from '@mui/material';
import { productPurchesValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import {useState, useEffect } from 'react';
import moment from 'moment';



const PurchaseInventory = (props) => {
  const { open, handleClose, hostelId, editPurchase } = props;
  console.log("props==>",props);

  const [allProductList, setProductList] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //When Found editPurchase Data
  useEffect(()=>{
    if(open && editPurchase){
      const formattedDate = moment(editPurchase.date).format('YYYY-MM-DD');
      formik.setValues({
        productName : editPurchase.productName || '',
        quantity : editPurchase.quantity || '',
        price : editPurchase.price || '',
        date : formattedDate || '',  
      });
    }
  },[open,editPurchase]);

  //Get All Product Which Adeed
  useEffect(()=>{
    if(open){
      axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory/index/${hostelId}`)
      .then(response => {
        console.log("response for Product ==>",response);

        const ProductNames = response.data.result.map(product => product['productName']);
        console.log("==>",ProductNames);
        setProductList(ProductNames);
      })
      .catch(error => {
        console.log("Product List is not Found!!",error);
      });
    }
  },[open]);
  console.log("allProductList==>",allProductList);



  const formik = useFormik({ 
    initialValues: {
      productName:'',
      quantity:'',
      price:'',
      date:''
    },
    validationSchema: productPurchesValidationSchema,
    onSubmit: async (values) => {
    console.log("Form is valid ====>", values);

    try{
      let response;
      if(editPurchase){
        response = await axios.put(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/edit/${editPurchase._id}`, values);

      }else{
        response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory_purches/add/${hostelId}`, values);
      }
      console.log("response==>",response);

      if(response.status === 201 || response.status === 200){
        console.log("Inventory Purchase Add Successfully !!");
        handleClose();
      }else {
        console.error('Failed to save data');
      }

    }catch(error){
      console.log("Found Error",error);
    }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editPurchase) {
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
          <Typography variant="h6">Inventory Purchase</Typography>
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
                    {
                      allProductList.map(product => (
                        <MenuItem key={product} value={product}>{product}</MenuItem>
                      ))
                    }
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
                  <FormLabel>Price</FormLabel>
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
export default PurchaseInventory;
