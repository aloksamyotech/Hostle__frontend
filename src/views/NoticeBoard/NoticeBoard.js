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
import { noticeValidationSchema } from 'views/Validation/validationSchema';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { HailSharp } from '@mui/icons-material';

const Notices = (props) => {
  const { open, handleClose, hostelId, editNotice } = props;

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //When Found editRoom Data
  useEffect(() => {
    if (open && editNotice) {
      const formattedDate = moment(editNotice.dateTime).format('YYYY-MM-DDTHH:mm');
      formik.setValues({
        noticeTitle: editNotice.noticeTitle || '',
        description: editNotice.description || '',
        dateTime: formattedDate || ''
      });
    }
  }, [open, editNotice]);

  const formik = useFormik({
    initialValues: {
      noticeTitle: '',
      dateTime: '',
      description: ''
    },
    validationSchema: noticeValidationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (editNotice) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/notice_board/edit/${editNotice._id}`, values);

            if (response.status === 200) {
              toast.success('Notice Edit Successfully !!');
            } else {
              console.error('Failed to edit data');
              toast.error('Failed to edit data');
            }
          } catch (error) {
            console.log('Error in Edit Notice =>', error);
            toast.error('Error in Edit Notice !!');
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/notice_board/add/${hostelId}`, values);

            if (response.status === 201) {
              toast.success('Notice Add Successfully !!');
            } else {
              console.error('Failed to save data');
              toast.error('Failed to save data');
            }
          } catch (error) {
            console.log('Error in Add Notice =>', error);
            toast.error('Error in Add Notice !!');
          }
        }

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Found Error =>', error);
        toast.error('something went wrong !!');
      }
    }
  });

  //For Reset Feilds When Add New
  useEffect(() => {
    if (open && !editNotice) {
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
          <Typography variant="h6">Notice Board</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Notice Title <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="noticeTitle"
                  name="noticeTitle"
                  size="small"
                  fullWidth
                  value={formik.values.noticeTitle}
                  onChange={formik.handleChange}
                  error={formik.touched.noticeTitle && !!formik.errors.noticeTitle}
                  helperText={formik.touched.noticeTitle && formik.errors.noticeTitle}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>
                  Date & Time <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
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

              <Grid item xs={12} sm={12} md={12}>
                <FormLabel>
                  Description <span style={{ color: 'red' }}>*</span>{' '}
                </FormLabel>
                <TextField
                  id="description"
                  name="description"
                  size="small"
                  multiline
                  fullWidth
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && !!formik.errors.description}
                  helperText={formik.touched.description && formik.errors.description}
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

export default Notices;
