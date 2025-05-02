import React, { useState, useEffect } from 'react';
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
  TableRow as MuiTableRow,
  TableContainer,
  TableHead,
  TextField,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  MenuItem
} from '@mui/material';
import Iconify from '../../ui-component/iconify';
import AllExpenses from './Expenditure';
import Cookies from 'js-cookie';
import axios from 'axios';

import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import { render } from '@fullcalendar/core/preact';

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

const Expenditure = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editExpense, setEditExpense] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState(null);

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchExpenses(hostelId);
  };

  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchExpenses(HosId);
  }, []);

  const fetchExpenses = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/expense/index/${hostelId}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/expense/index/${hostelId}`, {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }
      });
      setAllExpenses(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching expenses data:', error);
    }
  };

  const handleFilter = () => {
    fetchExpenses(hostelId);
  };

  // Handle Edit Action Here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    let expense = allExpenses.find((expense) => expense._id === id);
    console.log('expense==>', expense);
    setEditExpense(expense);
  };

  // Handle Delete Action Here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/expense/delete/${deleteId}`);
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/expense/delete/${deleteId}`);
      console.log('delete  response =====>', response);

      setOpenDeleteDialog(false);
      fetchExpenses(hostelId);
      handleClose();
    } catch (error) {
      console.error('Error deleting student:', error);
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
      field: 'expenseTitle',
      headerName: 'Expense Title',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return moment(params.row.date).format('YYYY-MM-DD');
      }
    },

    {
      field: 'monthName',
      headerName: 'Month Name',
      flex: 1
    },

    {
      field: 'billPhoto',
      headerName: 'Bill Photo',
      width: 150,
      renderCell: (params) => {
        const billPhoto = params.row.billPhoto;
        return billPhoto ? (
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/uploads/bills/${billPhoto}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            View Bill
          </a>
        ) : (
          <span style={{ color: '#aaa' }}>No Bill</span>
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
      <AllExpenses open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editExpense={editExpense} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
          <Typography variant="h3">All Expenditures</Typography>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
            <Button variant="contained" onClick={handleFilter}>
              Filter
            </Button>
          </Stack>
        </Stack>
        {/* <TableStyle>
          <Box width="100%">
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Expense Title</HeaderCell>
                      <HeaderCell>Date</HeaderCell>
                      <HeaderCell>Price</HeaderCell>
                      <HeaderCell>Bill Image</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.expenseTitle}</TableCell>
                        <TableCell>{moment.utc(row.date).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{row.price} /-</TableCell>
                        <TableCell>
                          {row.billPhoto && (
                            <a href={`${REACT_APP_BACKEND_URL}/uploads/bills/${row.billPhoto}`} target="_blank" rel="noopener noreferrer">
                              {row.billPhoto}
                            </a>
                          )}
                        </TableCell>
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
              {allExpenses && (
                <DataGrid
                  rows={allExpenses}
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
        <DialogTitle variant="h4">Delete Expenditure</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Expense Details?</Typography>
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

export default Expenditure;
