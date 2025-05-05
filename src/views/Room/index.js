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
import Cookies from 'js-cookie';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import ViewBeds from './ViewBeds';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router-dom';

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

  const theme = useTheme();

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchRoomsData(hostelId);
    handleClose();
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
  const handleEdit = () => {
    setOpenAdd(true);
    setRowData(row);
  };

  // Handle Delete Action Here
  const handleDelete = (id) => {
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

  const handleClickForBeds = (id) => {
    console.log('on click handleClickForBeds :', id);
    navigate(`/dashboard/room/view_beds/${id}`);
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S. No.',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
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
      flex: 1.5,
      renderCell: (params) => {
        const roomType = params.row.roomType;
        const roomCategory = params.row.roomCategory;
        const isAC = roomCategory === 'AC';

        return (
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: isAC ? theme.palette.primary.main : '#be4732',
              color: 'white',
              textTransform: 'none',
              fontWeight: 400,
              borderRadius: '8px',
              width: '130px',
              height: '32px',
              fontSize: '0.75rem',
              opacity: 1,
              pointerEvents: 'none',
              px: 1.5
            }}
            disableElevation
          >
            {capitalizeWords(roomType)} | {roomCategory}
          </Button>
        );
      }
    },
    {
      field: 'noOfBeds',
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
      field: 'roomPrice',
      headerName: 'Room Price',
      flex: 1,
      renderCell: (params) => `₹ ${params.value}`
    },
    {
      field: 'bookingStatus',
      headerName: 'Booking Status',
      flex: 1,
      renderCell: (params) => {
        const beds = params.row.availableBeds;

        return beds !== 0 ? (
          <Button variant="contained" color="primary" size="small" onClick={() => handleClickForBeds(params.row._id)}>
            Book Beds
          </Button>
        ) : (
          <Button variant="contained" color="error" size="small" disabled>
            Booked Beds
          </Button>
        );
      }
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

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <>
      <AddRoom open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} rowData={rowData} />
      <Container>
        <Box
          sx={{
            backgroundColor: 'white',
            height: '50px',
            width: '100%',
            display: 'flex',
            borderRadius: '10px',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 25px',
            mb: '20px'
          }}
        >
          <Stack direction="row" alignItems="center">
            <IconButton onClick={() => navigate('/dashboard/default')}>
              <HomeIcon color="primary" />
            </IconButton>
            <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
            <Typography variant="h5">Room List</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Card>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                Add Room
              </Button>
            </Card>
          </Stack>
        </Box>

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
            handleEdit();
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
