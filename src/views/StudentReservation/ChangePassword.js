import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useFormik } from 'formik';
import { FormLabel, FormControl } from '@mui/material';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const ChangeStatus = (props) => {
  const { open, handleClose, rowData } = props;
  console.log('-------------- ChangeStatus rowDataId :', rowData);
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const initialValues = {
    status: rowData?.studentId?.status || 'default'
  };

  const formik = useFormik({
    initialValues,

    validationSchema: yup.object({
      status: yup.string().notOneOf(['default'], 'Status is required')
    }),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const response = await axios.put(`${REACT_APP_BACKEND_URL}/sudent_reservation/change_status/${rowData?.studentId?._id}`, values);

        if (response.status === 200) {
          toast.success('Student details updated successfully !!');
        } else {
          toast.error('Failed to update Student details !!');
        }
      } catch (error) {
        console.error('Error updating status:', error);
      } finally {
        setLoading(false);
        handleClose();
      }
    }
  });

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" fullWidth maxWidth="xs">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Change Status</Typography>
          <Typography>
            <Button onClick={handleClose} style={{ color: 'red' }}>
              Cancel
            </Button>
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth>
                  <FormLabel>Change Status</FormLabel>
                  <Select
                    id="status"
                    name="status"
                    label=""
                    size="small"
                    fullWidth
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    <MenuItem value="default" disabled>
                      Select Status
                    </MenuItem>

                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">In-Active</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <DialogActions>
              <Button disabled={loading} type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ChangeStatus;
