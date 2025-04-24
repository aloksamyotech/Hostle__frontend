import { useState } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination } from '@mui/material';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddAdministrator from './AddAdministrator.js';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';


const Administrator = () => {

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [editAdmin, setEditAdmin] = useState(null);
  const [deleteAdminId, setDeleteAdminId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(()=>{
      fetchAdminData();
    },[openAdd]);

    //Get All Admin's Here
    const fetchAdminData = async () => {
      try{
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/administrator/list`);
        console.log("response==>",response);
        console.log("response.data.result==>",response.data.result);
        console.log("response.data.totalRecodes==>",response.data.totalRecodes);
        setAdminData(response.data.result);
        setTotalCount(response.data.totalRecodes);
      }catch(error){
        console.error("Error fetching admin data:", error);
      }
    }

    //Nevigate On View Page
    const handleNavigate = (id) => {
      navigate(`/dashboard/administrator/view/${id}`);
    };

    const handleOpenAdd = () => {
      setOpenAdd(true);
      setEditAdmin(null);
    };

    const handleCloseAdd = () => setOpenAdd(false);

    // Handle Edit Action Here
    const handleEdit = (id) => {
      console.log(`Edit clicked for ID: ${id}`);
      const admin = adminData.find(admin => admin._id === id);
      console.log("set admin for edit=>",admin);
      setOpenAdd(true);
      setEditAdmin(admin);
    };
    console.log("editAdmin=>",editAdmin);

    // Handle Delete Action Here
    const handleDelete = (id) => {
      setOpenDeleteDialog(true);
      console.log(`Delete clicked for ID: ${id}`);
      setDeleteAdminId(id);
    };

    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
      try {
        let response = await axios.delete(`${REACT_APP_BACKEND_URL}/administrator/delete/${deleteAdminId}`);
        console.log("response=>",response);
        setOpenDeleteDialog(false);
        fetchAdminData();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    };

    // Handle Pages
    const handleChangePage = (event, newPage) => {
      console.log("New Page:", newPage);
      setPage(newPage); 
    };

    // Handle Rows PerPage
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); 
    };

  return (
    <>
      <AddAdministrator open={openAdd} handleClose={handleCloseAdd} editAdminData={editAdmin} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Hostel Administrator</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Hostel Name</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email Id</TableCell>
                      <TableCell>Phone No</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.hostelname}</TableCell>
                        <TableCell
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                          onClick={() => handleNavigate(row._id)} 
                        >
                          {row.firstname} {row.lastname}
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phonenumber}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>
                          <Stack direction="row" >
                            <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" style={{ color: 'green' }} >
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
      </Container>

      {/*-------------------- Dialog for Delete ----------------- */}
    
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle variant="h4">Delete Administrator</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete this administrator?
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
    </>
  );
};
export default Administrator;