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
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  MenuItem,
  Popover
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../ui-component/iconify';
import AddRoom from './AddRoom';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';

const HeaderCell = styled(MuiTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.common.black,
  fontWeight: 'bold',
  padding: theme.spacing(1)
}));

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const TableRow = styled(MuiTableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const Room = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditRoom(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchRoomsData(hostelId);
  };

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //Navigate On View Page
  const handleNavigate = (id) => {
    navigate(`/dashboard/room/view/${id}`);
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setRowData(null);
  };

  const open = Boolean(anchorEl);

  // Get Hostel Obj Id Which is Set in Cookies
  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchRoomsData(Hos_Id);
  }, []);

  // Fetch All Room's Data Here
  const fetchRoomsData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/room/index/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });
      setRoomData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  // Handle Edit Action Here
  const handleEdit = (id) => {
    console.log('handleEdit id =>', id);
    setOpenAdd(true);
    let room = roomData.find((room) => room._id === id);
    setEditRoom(room);
  };

  // Handle Delete Action Here
  const handleDelete = (id) => {
    console.log('handleDelete id =>', id);
    setOpenDeleteDialog(true);
    setDeleteStudentId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${REACT_APP_BACKEND_URL}/room/deleteData/${deleteStudentId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });

      setOpenDeleteDialog(false);
      fetchRoomsData(hostelId);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // Handle Pages
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    {
      field: 'roomNumber',
      headerName: 'Room No',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Box onClick={() => handleNavigate(params.row._id)}>{params.value}</Box>
          </Box>
        );
      }
    },
    {
      field: 'roomType',
      headerName: 'Room Type',
      flex: 1
    },
    {
      field: 'numOfBeds',
      headerName: 'No Of Beds',
      flex: 1
    },
    {
      field: 'occupiedBeds',
      headerName: 'Occupied Beds',
      flex: 1
    },
    {
      field: 'availableBeds',
      headerName: 'Available Beds',
      flex: 1
    },

    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleClick(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];

  return (
    <>
      <AddRoom open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editRoom={editRoom} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Room Basic Details</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>

        {/* <Box width="100%" sx={{ mt: '10px' }}>
          <Card sx={{ border: 'none', boxShadow: 'none' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>Room No</HeaderCell>
                    <HeaderCell>Room Type</HeaderCell>
                    <HeaderCell>Total No. of Beds</HeaderCell>
                    <HeaderCell>Occupied Beds</HeaderCell>
                    <HeaderCell>Available Beds</HeaderCell>
                    <HeaderCell>Action</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                        onClick={() => handleNavigate(row._id)}
                      >
                        {row.roomNumber}
                      </TableCell>
                      <TableCell>{row.roomType}</TableCell>
                      <TableCell>{row.numOfBeds}</TableCell>
                      <TableCell>{row.occupiedBeds}</TableCell>
                      <TableCell>{row.availableBeds}</TableCell>
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
        </Box> */}

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              {roomData && (
                <DataGrid
                  rows={roomData}
                  columns={columns}
                  getRowId={(row) => row?._id}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{ toolbar: { showQuickFilter: true } }}
                />
              )}
            </Card>
          </Box>
        </TableStyle>
      </Container>

      {/* Dialog for Delete */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">Delete Room</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Room Details?</Typography>
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

      <Popover
        id={rowData?._id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() => {
            handleEdit(rowData._id);
            handleClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(rowData._id);
            handleClose();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'red' }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};
export default Room;
