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
import {FormLabel} from '@mui/material';
import { attendenceValidationSchema } from 'views/Validation/validationSchema';

const AddAttendence = (props) => {
  const { open, handleClose } = props;

  const formik = useFormik({
    initialValues: {
      studentHosId:'',
      date:'',
      outTime:'',
      inTime:''
    },
    validationSchema: attendenceValidationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      console.log('Form values:', values);
      handleClose();
    },
  });
  
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{display: 'flex',justifyContent: 'space-between'}}>
          <Typography variant="h6">Resident Attendence</Typography>
            <Typography>
              <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
            </Typography>
        </DialogTitle>

        <DialogContent dividers>
            <form>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormLabel>Student Hostel Id</FormLabel>
                        <TextField
                          id="studentHosId"
                          name="studentHosId"
                          size="small"
                          fullWidth
                          value={formik.values.studentHosId}
                          onChange={formik.handleChange}
                          error={formik.touched.studentHosId && !!formik.errors.studentHosId}
                          helperText={formik.touched.studentHosId && formik.errors.studentHosId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <FormLabel>Date</FormLabel>
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
                      <FormLabel>Out Time</FormLabel>
                        <TextField
                        id="outTime"
                        name="outTime"
                        type="time"
                        size="small"
                        fullWidth
                        value={formik.values.outTime}
                        onChange={formik.handleChange}
                        error={formik.touched.outTime && !!formik.errors.outTime}
                        helperText={formik.touched.outTime && formik.errors.outTime}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <FormLabel>In Time</FormLabel>
                        <TextField
                        id="inTime"
                        name="inTime"
                        type="time"
                        size="small"
                        fullWidth
                        value={formik.values.inTime}
                        onChange={formik.handleChange}
                        error={formik.touched.inTime && !!formik.errors.inTime}
                        helperText={formik.touched.inTime && formik.errors.inTime}
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

export default AddAttendence;
