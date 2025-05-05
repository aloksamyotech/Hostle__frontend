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
  IconButton,
  TablePagination
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddVisotor from './AddVisitor';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router-dom';

const Visitors = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [allVisitors, setAllVisitors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();

  const handleOpenAdd = () => setOpenAdd(true);

  const navigate = useNavigate();

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchVisitorData(hostelId);
  };

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchVisitorData(HosId);
  }, []);
  console.log('hostelId==>', hostelId);

  //Fetch Visitor's Data
  const fetchVisitorData = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/visitor/index/${hostelId}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/visitor/index/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });
      console.log('response===>', response);
      setAllVisitors(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching visitors data:', error);
    }
  };
  console.log('allVisitors ==================>', allVisitors);

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
      field: 'visitorName',
      headerName: 'Visitor Name',
      cellClassName: 'name-column--cell--capitalize',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Visitor Phone No',
      flex: 1
    },
    {
      field: 'visitorduration',
      headerName: 'Visit Duration (In Hr)',
      flex: 1.2,
      renderCell: (params) => {
        return params.row.roomData?.visitorduration;
      }
    },
    {
      field: 'dateTime',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return moment(params.row.dateTime).format('YYYY-MM-DD');
      }
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        const name = params.row.studentInfo?.studentName || '';
        const contact = params.row.studentInfo?.studentContact || '';

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
      headerName: 'RoomNo.',
      flex: 1,
      renderCell: (params) => {
        return params.row.roomData?.roomNumber;
      }
    }
  ];

  return (
    <>
      <AddVisotor open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} />
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
            <Typography variant="h5">Visitor List</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Card>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                Add Visitor
              </Button>
            </Card>
          </Stack>
        </Box>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              {allVisitors && (
                <DataGrid
                  rows={allVisitors}
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
    </>
  );
};
export default Visitors;
