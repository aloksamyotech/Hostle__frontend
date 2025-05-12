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
  IconButton,
  Chip
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
import moment from 'moment';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GenerateBill from './GenerateBill';

const PaymentList = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hostelId, setHostelId] = useState();
  const [studentPaymentData, setStudentPaymentData] = useState([]);

  const [currentStudent, setCurrentStudent] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [openGenerateBill, setOpenGenerateBill] = useState(false);

  const navigate = useNavigate();

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
      console.log("this is setStudentPaymentData :::", response.data.result);
      
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

  const handleOpenGenerateBill = (event, row) => {
    // setOpenGenerateBill(true);
    setRowData(row);
    navigate(`/paymentslip/view/${row._id}`);
  };

  const handleCloseGenerateBill = () => {
    setOpenGenerateBill(false);
    setRowData(null);
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
      field: 'sno',
      headerName: 'S. No.',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1.5,
      renderCell: (params) => {
        const name = params.row.studentData?.studentName || '';
        const contact = params.row.studentData?.studentContact || '';

        return (
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {contact}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'roomNumber',
      headerName: 'Room Number',
      flex: 1,
      renderCell: (params) => params.row.bedData?.roomNumber || ''
    },

    {
      field: 'date',
      headerName: 'Payment Date',
      flex: 1,
      renderCell: (params) => moment(params.row.date).format('YYYY-MM-DD') || ''
    },

    {
      field: 'totalRent',
      headerName: 'Total Rent',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.totalRent}` || 0
    },

    {
      field: 'finalTotalRent',
      headerName: 'Final TotalRent',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.finalTotalRent}` || 0
    },

    {
      field: 'paidAmount',
      headerName: 'Paid Amount',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.paymentAmount}` || 0
    },
    {
      field: 'remainingAmount',
      headerName: 'Pending Amount',
      flex: 1,
      renderCell: (params) => ` ₹ ${params.row.remainingAmount}` || 0
    },

    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      flex: 1,
      renderCell: (params) => {
        const status = params.row.paymentStatus || 'Pending';
        const isPending = status.toLowerCase() === 'pending';

        return (
          <Chip
            label={status}
            color={isPending ? 'error' : 'success'}
            variant="outlined"
            size="small"
            sx={{
              width: '100px',
              justifyContent: 'center',
              textTransform: 'capitalize'
            }}
          />
        );
      }
    },
    {
      field: 'generateBill',
      headerName: 'Generate Bill',
      flex: 1.3,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            onClick={(event) => handleOpenGenerateBill(event, params.row)}
            sx={{
              backgroundColor: '#4CAF50', 
              color: '#fff',
              '&:hover': {
                backgroundColor: '#45A049' 
              }
            }}
          >
            Generate Bill
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <GenerateBill open={openGenerateBill} handleClose={handleCloseGenerateBill} hostelId={hostelId} rowData={rowData} />
      <AddPayment open={openAddPayment} handleClose={handleCloseAddPayment} hostelId={hostelId} currentStudent={currentStudent} />
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
            <Typography variant="h5">Student Payments List</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Card>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                Add Payment
              </Button>
            </Card>
          </Stack>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              {studentPaymentData && (
                <DataGrid
                  rows={studentPaymentData}
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
