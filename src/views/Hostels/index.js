import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddHostel from './AddHostel';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hostel = () => {
  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editHostel, setEditHostel] = useState(null);
  const [deleteHostelId, setDeleteHostelId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchHostelData();
  }, [openAdd]);

  const fetchHostelData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/list`);
      console.log('response==>', response);
      setHostelData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    }
  };

  const handleNavigate = (_id) => {
    navigate(`/superadmindashboard/hostel/view/${_id}`);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditHostel(null);
  };

  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    console.log('edit on id =>', id);
    const hostel = hostelData.find((hostel) => hostel._id === id);
    setOpenAdd(true);
    setEditHostel(hostel);
  };

  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setDeleteHostelId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${REACT_APP_BACKEND_URL}/hostel/delete/${deleteHostelId}`);
      setOpenDeleteDialog(false);
      fetchHostelData();
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log('New Page:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <AddHostel open={openAdd} handleClose={handleCloseAdd} editHostelData={editHostel} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
          <Typography variant="h4">Hostel Basic Information</Typography>
          <Stack direction="row" alignItems="center">
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
                      <TableCell>Owner Name</TableCell>
                      <TableCell>Email Id</TableCell>
                      <TableCell>Hostel Contact no</TableCell>
                      <TableCell>Owner Contact no</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hostelData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row._id}>
                        <TableCell
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                          onClick={() => handleNavigate(row._id)}
                        >
                          {row.hostelName}
                        </TableCell>
                        <TableCell>{row.ownerName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.hostelPhoneNumber}</TableCell>
                        <TableCell>{row.ownerPhoneNumber}</TableCell>
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
      </Container>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Hostel</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Hostel?</Typography>
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

export default Hostel;
