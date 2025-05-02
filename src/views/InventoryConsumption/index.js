import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Popover
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import ConsumptionInventory from './InventoryConsumption';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const InventoryConsumption = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allConsumeProducts, setConsumeProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editConsumeProduct, setEditConsumeProduct] = useState(null);
  const [deleteConsumeProduct, setDeleteConsumeProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditConsumeProduct(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchConsumptionProducts(hostelId);
  };

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchConsumptionProducts(HosId);
  }, []);
  console.log('hostelId==>', hostelId);

  const fetchConsumptionProducts = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/canteen_inventory_consume/index/${hostelId}`);
      console.log('response==>', response);
      setConsumeProducts(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching consume inventory data:', error);
    }
  };

  //Handle Edit Action Here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);

    const product = allConsumeProducts.find((product) => product._id === id);
    setEditConsumeProduct(product);
  };

  //Handle Delete Action Here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteConsumeProduct(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/canteen_inventory_consume/delete/${deleteConsumeProduct}`);
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/canteen_inventory_consume/delete/${deleteConsumeProduct}`);
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchConsumptionProducts(hostelId);
    } catch (error) {
      console.error('Error deleting inventory:', error);
    }
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
      headerName: 'productName',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Box onClick={() => handleNavigate(params.row._id)}>{params.value}</Box>
          </Box>
        );
      }
    },
    {
      field: 'quantity',
      headerName: 'quantity',
      flex: 1,
      renderCell: (params) => {
        return params.row.productId.mesurment ? `${params.value} ${params.row.productId.mesurment}` : params.value;
      }
    },
    {
      field: 'remaning',
      headerName: 'remaning',
      flex: 1,
      renderCell: (params) => {
        return params.row.productId.mesurment ? `${params.value} ${params.row.productId.mesurment}` : params.value;
      }
    },
    {
      field: 'date',
      headerName: 'date',
      flex: 1,
      renderCell: (params) => {
        return moment(params.value).format('YYYY-MM-DD');
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
      <ConsumptionInventory open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editConsumeProduct={editConsumeProduct} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Inventory Consumption</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              {allConsumeProducts && (
                <DataGrid
                  rows={allConsumeProducts}
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
export default InventoryConsumption;
