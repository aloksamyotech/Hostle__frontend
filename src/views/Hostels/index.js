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
  TablePagination,
  MenuItem,
  Popover
} from '@mui/material';
import Iconify from '../../ui-component/iconify';
import AddHostel from './AddHostel';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    fetchHostelData();
  }, [openAdd]);

  const fetchHostelData = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/hostel/list`);
    
      setHostelData(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    }
  };

  const handleNavigate = (_id) => {
    navigate(`/superadmindashboard/hostel/view/${_id}`);
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

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditHostel(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    handleClose();
  };

  const handleEdit = (id) => {
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
    handleClose();
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${REACT_APP_BACKEND_URL}/hostel/delete/${deleteHostelId}`);
    

      if (response.status === 200) {
     
        toast.success('Hostel Data Delete Successfully !!');
      } else {
        toast.error('Failed to Delete Hostel Data !!');
        console.error('Failed to Delete Hostel Data !!');
      }

      setOpenDeleteDialog(false);
      handleClose();
      fetchHostelData();
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
 
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      field: 'hostelName',
      headerName: 'Hostel Name',
      flex: 1.5,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box onClick={() => handleNavigate(params.row._id)} sx={{ cursor: 'pointer' }}>
            <Typography variant="body1" fontWeight="bold">
              {params.row.hostelName}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'hostelPhoneNumber',
      headerName: 'Hostel ContactNo.',
      flex: 1.5
    },
    {
      field: 'email',
      headerName: 'Email Id',
      flex: 1.5
    },
    {
      field: 'ownerName',
      headerName: 'Owner Name',
      flex: 1.5,
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {params.row.ownerName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.ownerPhoneNumber}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.5
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
      <AddHostel open={openAdd} handleClose={handleCloseAdd} editHostelData={editHostel} />
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
            <IconButton onClick={() => navigate('/superadmindashboard/default')}>
              <HomeIcon color='primary'/>
            </IconButton>
            <ArrowBackIosNewRoundedIcon sx={{ transform: 'rotate(180deg)', fontSize: '18px', color: 'black', mr: 1 }} />
            <Typography variant="h5">Hostel List</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Card>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                Add Hostel
              </Button>
            </Card>
          </Stack>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '500px', paddingTop: '15px' }}>
              {hostelData && (
                <DataGrid
                  rows={hostelData}
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

export default Hostel;
