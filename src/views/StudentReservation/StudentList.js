import React, { useState, useEffect } from 'react';
import {Card, CardMedia, Stack, Button, Container, Typography, Box,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton ,Dialog, DialogTitle, DialogContent, DialogActions,TablePagination,Tab, Tabs} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { productPurchesValidationSchema } from 'views/Validation/validationSchema';
import { useNavigate } from 'react-router';
import AddNewReservation from './AddNewReservation';


const StudentList = (props) => {
  const {studentData, totalCount, fetchReserveStudentData, hostelId  } = props;


  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [hostelid, setHostelId] = useState(null);
  const [componentKey, setComponentKey] = useState(0);
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(()=>{
    if(hostelId){
      setHostelId(hostelId);
    }
  },[hostelId]);

    // Handle Pages
    const handleChangePage = (event, newPage) => {
 
      setPage(newPage); 
    };

    // Handle Rows PerPage
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); 
    };

    // Navigate On View Page
    const handleNavigate = (id) => {
   
      
      navigate(`/dashboard/student_reservation/view_profile/${id}`);
    };

    const handleEdit = (id) =>{
   
      setOpenAdd(true);

      let student = studentData.find(student => student._id === id);
    
      setEditStudent(student);
      // setHostelId(hostelId);
    } 

    // Handle Delete Action Here
    const handleDelete = (id) => {
   
      setOpenDeleteDialog(true);
      setDeleteStudentId(id)
    };

    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
    };

  const handleConfirmDelete = async () => {
    try {
    
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/sudent_reservation/deleteData/${deleteStudentId}`);
  
      setOpenDeleteDialog(false);
      fetchReserveStudentData(hostelid);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

    const handleCloseAdd = ()=> {
      setOpenAdd(false);
      fetchReserveStudentData(hostelid);
    }

    return(<>
       <AddNewReservation open={openAdd} handleClose={handleCloseAdd} editStudent={editStudent} hostelId={hostelId}/>
       
        {/* <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '0px' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label='Student List'/>
              <Tab label='Add Monthly Payment'/>
            </Tabs>
          </Box>
        </Box> */}
        <TableStyle key={componentKey}>
          <Box width="100%" sx={{mt : '10px'}}>
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Email Id</TableCell>
                      <TableCell>Student ContactNo.</TableCell>
                      <TableCell>Room No</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {studentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                          onClick={() => handleNavigate(row._id)}
                        >{row.studentName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.studentPhoneNo}</TableCell>
                        <TableCell>{row.roomNumber}</TableCell>
                        <TableCell>{row.city} {row.state} {row.address} </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" style={{ color: 'green' }}>
                              <EditOutlined />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row._id)} aria-label="delete" style={{ color: 'red' }}>
                              <DeleteOutline />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> 
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Box>
        </TableStyle> 


      {/*-------------------- Dialog for Delete ----------------- */}
      
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle variant="h4">Delete Administrator</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete this Room Details?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} variant="contained" color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
      </Dialog>
    </>);
}

export default StudentList;











