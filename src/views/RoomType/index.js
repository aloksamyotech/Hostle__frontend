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
import AddRoomType from './AddRoomType';

const RoomType = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState(null);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    handleClose();
  };

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
    fetchRoomTypesData(Hos_Id);
  }, [openAdd]);

  // Fetch All Room's Data Here
  const fetchRoomTypesData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/roomTypes/getall/${hostelId}`);
      setRoomData(response.data.result);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

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
      await axios.delete(`${REACT_APP_BACKEND_URL}/roomTypes/delete/${rowData._id}`);
      setOpenDeleteDialog(false);
      fetchRoomTypesData(hostelId);
      handleClose();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
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
      field: 'roomType',
      headerName: 'Room Type',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'roomCategory',
      headerName: 'Room Category',
      flex: 1,
      renderCell: (params) => {
        const isAc = params.value === 'AC';
        return (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              width: '70px',
              borderRadius: 1,
              color: '#fff',
              backgroundColor: isAc ? 'info.main' : '#be4732',
              display: 'inline-block',
              textAlign: 'center',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            {isAc ? 'AC' : 'Non-AC'}
          </Box>
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

  return (
    <>
      <AddRoomType open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} rowData={rowData} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Room Types Details</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>

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
          <Typography variant="body2">Are you sure you want to delete this Room Type Details?</Typography>
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
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(rowData._id);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'red' }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};
export default RoomType;
