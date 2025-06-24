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
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import { addExpenseValidationSchema, editExpenseValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { handleApiResponse } from 'utils/common';

const AllExpenses = (props) => {
  const { open, handleClose, hostelId, editExpense } = props;
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [existingImgFile, setExistingImgFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      expenseTitle: '',
      price: '',
      date: '',
      billPhoto: ''
    },
    validationSchema: editExpense ? editExpenseValidationSchema : addExpenseValidationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === 'billPhoto') {
          formData.append('billPhoto', values.billPhoto);
        } else {
          formData.append(key, values[key]);
        }
      });

      try {
        let response;
        if (editExpense) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/expense/edit/${editExpense._id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            await handleApiResponse(response, 'UPDATE');
          } catch (error) {
            console.log('Error in edit Expense', error);
            toast.error('Error in edit Expense');
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/expense/add/${hostelId}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            await handleApiResponse(response);
          } catch (error) {
            console.log('Error in add Expense', error);
            toast.error('Error in add Expense');
          }
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Found Error =>', error);
        toast.error('Error in add Expense');
      }
    }
  });

  useEffect(() => {
    if (open && editExpense) {
      formik.setValues({
        expenseTitle: editExpense.expenseTitle || '',
        price: editExpense.price || '',
        date: moment(editExpense.date).format('YYYY-MM-DD'),
        billPhoto: ''
      });
      setExistingImgFile(editExpense.billPhoto);
    }
  }, [open, editExpense]);

  useEffect(() => {
    if (open && !editExpense) {
      formik.resetForm();
      setExistingImgFile('');
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">All Expenditures</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Expense Title <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="expenseTitle"
                  name="expenseTitle"
                  size="small"
                  fullWidth
                  value={formik.values.expenseTitle}
                  onChange={formik.handleChange}
                  error={formik.touched.expenseTitle && !!formik.errors.expenseTitle}
                  helperText={formik.touched.expenseTitle && formik.errors.expenseTitle}
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
                  Date <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="date"
                  name="date"
                  type="date"
                  size="small"
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
                  id="billPhoto"
                  name="billPhoto"
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue('billPhoto', event.currentTarget.files[0]);
                    setExistingImgFile(null);
                  }}
                />
                {existingImgFile && !formik.values.billPhoto && <Typography>Current file: {existingImgFile}</Typography>}
                {formik.values.billPhoto && formik.values.billPhoto.name && (
                  <Typography>Selected file: {formik.values.billPhoto.name}</Typography>
                )}
                {formik.touched.billPhoto && formik.errors.billPhoto && <FormHelperText error>{formik.errors.billPhoto}</FormHelperText>}
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

export default AllExpenses;
