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
  console.log('hostelId=========>', hostelId);

  //Fetching Data Here
  const fetchInventory = async (hostelId) => {
    try {
      console.log('URL=>', `${REACT_APP_BACKEND_URL}/canteen_inventory/index/${hostelId}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory/index/${hostelId}`);
      console.log('response fetch ===> ', response);
      setAllInventory(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };
  console.log('allInventory==>', allInventory);

  // Handle view action here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    let inventory = allInventory.find((inventory) => inventory._id === id);
    console.log('inventory==>', inventory);
    setEditInventory(inventory);
  };
  console.log('editInventory=>', editInventory);

  // Handle view action here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteInventoryId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/canteen_inventory/delete/${deleteInventoryId}`);
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/canteen_inventory/delete/${deleteInventoryId}`);
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchInventory(hostelId);
    } catch (error) {
      console.error('Error deleting inventory:', error);
    }
  };

  // Handle Pages
  const handleChangePage = (event, newPage) => {
    console.log('New Page:', newPage);
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

      console.log('jsonData ====>', jsonData);

      try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/canteen_inventory/importFile/${hostelId}`, jsonData);
        console.log('yha hai response ==>', response);
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
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Canteen Inventory</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>

            {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" onClick={handleOpenImportModal} />}>
              Import
            </Button> */}
          </Stack>
        </Stack>
        {/* <TableStyle>
          <Box width="100%">
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Product Name</HeaderCell>
                      <HeaderCell>Measurement</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allInventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.productName}</TableCell>
                        <TableCell>{row.mesurment}</TableCell>
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
        </TableStyle> */}

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
