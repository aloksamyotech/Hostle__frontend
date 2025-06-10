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
import { roomValidationSchema, roomEditValidationSchema } from 'views/Validation/validationSchema';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from 'react-toastify';
import { handleApiResponse } from 'utils/common';

const AddRoom = (props) => {

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const { open, handleClose, hostelId, rowData } = props;



  const [roomType, setRoomType] = useState([]);
  const [roomPhotos, setRoomPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const formik = useFormik({
    initialValues: {
      roomTypeId: rowData?.roomTypeId || '',
      roomType: rowData?.roomType || '',
      roomNumber: rowData?.roomNumber || '',
      noOfBeds: rowData?.noOfBeds || '',
      roomPrice: rowData?.roomPrice || '',
      roomphoto: []
    },
    validationSchema: rowData ? roomEditValidationSchema(rowData?.occupiedBeds) : roomValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
     
      try {
        const formData = new FormData();
        formData.append('roomTypeId', values.roomTypeId);
        formData.append('roomType', values.roomType);
        formData.append('roomNumber', values.roomNumber);
        formData.append('noOfBeds', values.noOfBeds);
        formData.append('roomPrice', values.roomPrice);

        roomPhotos.forEach((photo) => {
          formData.append('roomPhotos', photo);
        });

        let response;

        if (rowData) {
          try {
            response = await axios.put(`${REACT_APP_BACKEND_URL}/room/edit/${rowData?._id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            const res = await handleApiResponse(response, 'UPDATE');
           
          } catch (error) {
            console.log('Error:', error);
            // toast.error('Something went wrong !!');
          }
        } else {
          try {
            response = await axios.post(`${REACT_APP_BACKEND_URL}/room/add/${hostelId}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            const res = await handleApiResponse(response);
          } catch (error) {
            console.log('Error:', error);
            toast.error('Something went wrong !!');
          }
        }

        setRoomPhotos([]);
        setPreviews([]);

        handleClose();
        formik.resetForm();
      } catch (error) {
        console.log('Error=>', error);
        toast.error('Something went wrong!');
      }
    }
  });

  useEffect(() => {
    fetchRoomTypesData(hostelId);
  }, [open]);

  useEffect(() => {
    if (rowData && rowData.roomphoto?.length > 0) {
      const fullImageUrls = rowData.roomphoto.map((img) => (img.startsWith('http') ? img : `${REACT_APP_BACKEND_URL}${img}`));
      setPreviews(fullImageUrls);
    }
  }, [rowData]);

  const fetchRoomTypesData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/roomTypes/getall/${hostelId}`);
      const res = await handleApiResponse(response);
      setRoomType(res?.data);
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
            <ClearIcon
              onClick={() => {
                handleClose();
                formik.resetForm();
                setRoomPhotos([]);
                setPreviews([]);
              }}
              style={{ cursor: 'pointer' }}
            />
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Room Type</FormLabel>
                <Select
                  id="roomTypeId"
                  name="roomTypeId"
                  size="small"
                  fullWidth
                  value={formik.values.roomTypeId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedType = roomType.find((type) => type._id === selectedId);

                    formik.setFieldValue('roomTypeId', selectedId);
                    formik.setFieldValue('roomType', selectedType?.roomType || '');
                  }}
                  error={formik.touched.roomTypeId && !!formik.errors.roomTypeId}
                >
                  <MenuItem value="">Select Room Type</MenuItem>
                  {roomType?.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.roomType} | {type.roomCategory}
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
              <Button
                onClick={() => {
                  handleClose();
                  formik.resetForm();
                  setRoomPhotos([]);
                  setPreviews([]);
                }}
                variant="outlined"
                color="error"
              >
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
