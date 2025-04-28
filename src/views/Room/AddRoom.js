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
import { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const AddRoom = (props) => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const { open, handleClose, hostelId, editRoom } = props;

  const [roomType, setRoomType] = useState();
  const [roomPhotos, setRoomPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const formik = useFormik({
    initialValues: {
      roomCategory: '',
      roomType: '',
      roomNumber: '',
      noOfBeds: '',
      roomPrice: '',
      roomphoto: []
    },
    validationSchema: roomValidationSchema,

    onSubmit: async (values) => {
      console.log('Form values hyyyyyyyyyyyyy ======>', values);
      try {
        const formData = new FormData();

        formData.append('roomCategory', values.roomCategory);
        formData.append('roomType', values.roomType);
        formData.append('roomNumber', values.roomNumber);
        formData.append('noOfBeds', values.noOfBeds);
        formData.append('roomPrice', values.roomPrice);

        roomPhotos.forEach((photo) => {
          formData.append('roomPhotos', photo);
        });

        const response = await axios.post(`${REACT_APP_BACKEND_URL}/room/add/${hostelId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('response : =====>', response);

        if (response.status === 201) {
          toast.success('Room Details Added Successfully !!');
          handleClose();
          formik.resetForm();
          setRoomPhotos([]);
          setPreviews([]);
        } else {
          toast.error('Failed to Add Room Details');
        }
      } catch (error) {
        console.log('Error=>', error);
        toast.error('Something went wrong!');
      }
    }
  });

  useEffect(() => {
    fetchRoomTypesData(hostelId);
  }, [open]);

  const fetchRoomTypesData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/roomTypes/getall/${hostelId}`);
      setRoomType(response.data.result);
    } catch (error) {
      console.error('Error fetching Room Type Data:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = [...roomPhotos, ...files].slice(0, 3);
    const newPreviews = newPhotos.map((file) => URL.createObjectURL(file));

    setRoomPhotos(newPhotos);
    setPreviews(newPreviews);
    formik.setFieldValue('roomphoto', newPhotos);
  };

  const handleRemoveImage = (index) => {
    const updatedPhotos = [...roomPhotos];
    updatedPhotos.splice(index, 1);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);

    setRoomPhotos(updatedPhotos);
    setPreviews(updatedPreviews);
    formik.setFieldValue('roomphoto', updatedPhotos);
  };

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
          <Typography variant="h6">Room Basic Details</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Category</FormLabel>
                <Select
                  id="roomCategory"
                  name="roomCategory"
                  size="small"
                  fullWidth
                  value={formik.values.roomCategory}
                  onChange={formik.handleChange}
                  error={formik.touched.roomCategory && !!formik.errors.roomCategory}
                >
                  <MenuItem value="">Select Room Category</MenuItem>
                  <MenuItem value="AC">AC</MenuItem>
                  <MenuItem value="Non-AC">Non-AC</MenuItem>
                </Select>
                {formik.touched.roomCategory && formik.errors.roomCategory && (
                  <FormHelperText error>{formik.errors.roomCategory}</FormHelperText>
                )}
              </Grid>

              {/* Room Type Selection */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Type</FormLabel>
                <Select
                  id="roomType"
                  name="roomType"
                  size="small"
                  fullWidth
                  value={formik.values.roomType}
                  onChange={formik.handleChange}
                  error={formik.touched.roomType && !!formik.errors.roomType}
                >
                  <MenuItem value="">Select Room Type</MenuItem>
                  {roomType
                    ?.filter((type) => type.roomCategory === formik.values.roomCategory)
                    .map((type) => (
                      <MenuItem key={type._id} value={type.roomType}>
                        {type.roomType}
                      </MenuItem>
                    ))}
                </Select>
                {formik.touched.roomType && formik.errors.roomType && <FormHelperText error>{formik.errors.roomType}</FormHelperText>}
              </Grid>

              {/* Room Number Input */}
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Number</FormLabel>
                <TextField
                  id="roomNumber"
                  name="roomNumber"
                  size="small"
                  fullWidth
                  value={formik.values.roomNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.roomNumber && !!formik.errors.roomNumber}
                  helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>No of Beds</FormLabel>
                <TextField
                  id="noOfBeds"
                  name="noOfBeds"
                  size="small"
                  fullWidth
                  type="number"
                  value={formik.values.noOfBeds}
                  onChange={formik.handleChange}
                  error={formik.touched.noOfBeds && !!formik.errors.noOfBeds}
                  helperText={formik.touched.noOfBeds && formik.errors.noOfBeds}
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Price</FormLabel>
                <TextField
                  id="roomPrice"
                  name="roomPrice"
                  size="small"
                  fullWidth
                  type="number"
                  value={formik.values.roomPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.roomPrice && !!formik.errors.roomPrice}
                  helperText={formik.touched.roomPrice && formik.errors.roomPrice}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Room Photo Upload */}
              {/* <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Select Multiple Room Photos</FormLabel>
                <input
                  id="roomphoto"
                  name="roomphoto"
                  type="file"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files);
                    formik.setFieldValue('roomphoto', files);
                  }}
                />
                {Array.isArray(editRoom?.roomphoto) && editRoom.roomphoto.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <Typography variant="body2" fontWeight="bold">
                      Existing Photos:
                    </Typography>
                    {editRoom.roomphoto.map((fileName, index) => (
                      <Typography key={index} variant="body2">
                        {fileName}
                      </Typography>
                    ))}
                  </div>
                )}
                {formik.touched.roomphoto && formik.errors.roomphoto && <FormHelperText error>{formik.errors.roomphoto}</FormHelperText>}
              </Grid> */}

              <Grid item xs={12}>
                <FormLabel>Upload Room Photos (Max 3)</FormLabel>
                <Grid container spacing={2}>
                  {previews.map((preview, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <div>
                        <img
                          src={preview}
                          alt={`Thumbnail ${index + 1}`}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                        />
                        <Button size="small" color="error" onClick={() => handleRemoveImage(index)} style={{ marginTop: '8px' }}>
                          Remove
                        </Button>
                      </div>
                    </Grid>
                  ))}
                  {roomPhotos.length < 3 && (
                    <Grid item xs={12} sm={4}>
                      <label>
                        <AddPhotoAlternateIcon
                          style={{
                            fontSize: '48px',
                            color: '#ccc',
                            border: '1px dashed #ccc',
                            borderRadius: '4px',
                            padding: '10px',
                            width: '100px',
                            height: '100px',
                            cursor: 'pointer'
                          }}
                        />
                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </Grid>
                  )}
                </Grid>
                {formik.touched.roomphoto && formik.errors.roomphoto && <FormHelperText error>{formik.errors.roomphoto}</FormHelperText>}
              </Grid>
            </Grid>

            <DialogActions>
              <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button onClick={handleClose} variant="outlined" color="error">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoom;
