import {
  Stack,
  TextField,
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
  TablePagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Popover,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPayment from './AddPayment';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import { width } from '@mui/system';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableStyle from '../../ui-component/TableStyle';

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

const PaymentList = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hostelId, setHostelId] = useState();
  const [studentPaymentData, setStudentPaymentData] = useState([]);
  const [paymentRecordsCount, setPaymentRecords] = useState(0);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState(null);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };
  console.log('status==>', status);

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchPaymentData(Hos_Id);
  }, []);

  const fetchPaymentData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/list/${hostelId}`);
      setStudentPaymentData(response.data.result);
      setPaymentRecords(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleOpenAdd = () => {
    setOpenAddPayment(true);
  };

  const handleCloseAddPayment = () => {
    setOpenAddPayment(false);
    fetchPaymentData(hostelId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setPage(0);
    }
  };

  const generalFilter = (row) => {
    const lowerCaseQuery = query.toLowerCase();
    return Object.values(row).some((value) => {
      return value !== undefined && value !== null && value.toString().toLowerCase().includes(lowerCaseQuery);
    });
  };

  const statusFilter = (row) => {
    if (status === 'All') return true;
    return status === 'Complete' ? row.monthlyPending <= 0 : row.monthlyPending > 0;
  };

  const filteredData = studentPaymentData.filter(generalFilter).filter(statusFilter);

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
      field: 'month',
      headerName: 'month',
      flex: 1
    },
    {
      field: 'libraryAmount',
      headerName: 'libraryAmount',
      flex: 1
    },
    {
      field: 'foodAmount',
      headerName: 'refoodAmountmaning',
      flex: 1
    },
    {
      field: 'hostelRent',
      headerName: 'hostelRent',
      flex: 1,
      
    },

    {
      field: 'monthlyTotalAmount',
      headerName: 'monthlyTotalAmount',
      flex: 1,
      
    },

    {
      field: 'paidAmount',
      headerName: 'paidAmount',
      flex: 1,
      
    },
    {
      field: 'monthlyPending',
      headerName: 'monthlyPending',
      flex: 1,
      
    },

    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <IconButton onClick={(event) => handleClick(event, params.row)}>
    //       <MoreVertIcon />
    //     </IconButton>
    //   )
    // }
  ];

  return (
    <>
      <AddPayment open={openAddPayment} handleClose={handleCloseAddPayment} hostelId={hostelId} currentStudent={currentStudent} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Student Payments</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <FormControl variant="filled" size="small" style={{ width: 140 }}>
              <InputLabel>Filter By Status</InputLabel>
              <Select value={status} onChange={handleStatusChange} defaultValue="All" label="Filter By Status">
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="search"
              label="Search"
              value={query}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              placeholder="Type to search by any field"
            />
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
                    <HeaderCell>Student Name</HeaderCell>
                    <HeaderCell>Month</HeaderCell>
                    <HeaderCell>Library Amount</HeaderCell>
                    <HeaderCell>Food Amount</HeaderCell>
                    <HeaderCell>Hostel Rent</HeaderCell>
                    <HeaderCell>Monthly Total Rent</HeaderCell>
                    <HeaderCell>Monthly Paid Amount</HeaderCell>
                    <HeaderCell>Monthly Pending Amount</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {row.studentName}
                        <br />
                        {row.studentPhoneNo}
                      </TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.libraryAmount}</TableCell>
                      <TableCell>{row.foodAmount}</TableCell>
                      <TableCell>{row.hostelRent}</TableCell>
                      <TableCell>{row.monthlyTotalAmount}</TableCell>
                      <TableCell>{row.paidAmount}</TableCell>
                      <TableCell sx={{ color: row.monthlyPending > 0 ? 'red' : 'inherit' }}>{row.monthlyPending}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          {row.monthlyPending > 0 ? (
                            <Typography variant="body2" color="error">
                              Pending
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="success">
                              Complete
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={paymentRecordsCount}
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
              {filteredData && (
                <DataGrid
                  rows={filteredData}
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

export default PaymentList;
