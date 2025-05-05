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
import Iconify from '../../ui-component/iconify';
import AddInventory from './AddInventory';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router';

const CanteenInventory = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allInventory, setAllInventory] = useState([]);
  const [editInventory, setEditInventory] = useState(null);
  const [deleteInventoryId, setDeleteInventoryId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();
  const [openImportModal, setOpenImportModal] = useState(false);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditInventory(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchInventory(hostelId);
  };

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchInventory(HosId);
  }, []);
  

  //Fetching Data Here
  const fetchInventory = async (hostelId) => {
    try {
    
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory/index/${hostelId}`);
      
      setAllInventory(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };
 

  // Handle view action here
  const handleEdit = (id) => {
  
    setOpenAdd(true);
    let inventory = allInventory.find((inventory) => inventory._id === id);
   
    setEditInventory(inventory);
  };


  // Handle view action here
  const handleDelete = (id) => {
   
    setOpenDeleteDialog(true);
    setDeleteInventoryId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
    
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/canteen_inventory/delete/${deleteInventoryId}`);
    

      setOpenDeleteDialog(false);
      fetchInventory(hostelId);
    } catch (error) {
      console.error('Error deleting inventory:', error);
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

  //for imported file handle
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

    

      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory/importFile/${hostelId}`, jsonData);
      
        if (response.status === 200) {
          fetchInventory(hostelId);
        } else {
          console.error('Failed to import items');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  //for import button
  const handleOpenImportModal = () => {
    setOpenImportModal(true);
  };

  const handleCloseImportModal = () => {
    setOpenImportModal(false);
    fetchInventory(hostelId);
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
      field: 'productName',
      headerName: 'Product Name',
      flex: 1
    },
    {
      field: 'mesurment',
      headerName: 'Mesurment',
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
      <AddInventory open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editInventory={editInventory} />
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
            <Typography variant="h5">Canteen Inventory List</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Card>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                Add Inventory Item
              </Button>
            </Card>
          </Stack>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              {allInventory && (
                <DataGrid
                  rows={allInventory}
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

      {/*-------------------- Dialog for Delete ----------------- */}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">Delete Administrator</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Product?</Typography>
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

      {/* -------------------- for import button ------------------ */}

      <Dialog open={openImportModal} onClose={handleCloseImportModal} sx={{ minWidth: '500px', padding: '20px', borderRadius: '10px' }}>
        <DialogTitle>Import Items File Form Here</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Button variant="contained" component="label">
              Upload File
              <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportModal} color="secondary">
            Close
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
export default CanteenInventory;
