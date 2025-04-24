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
      field: 'studentName',
      headerName: 'Student Name',
      cellClassName: 'name-column--cell--capitalize',
      flex: 1
    },
    {
      field: 'roomNumber',
      headerName: 'Room No',
      flex: 1,
      renderCell: (params) => {
        return params.row.studentId.roomNumber;
      }
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
      field: 'dateTime',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return moment(params.row.dateTime).format('YYYY-MM-DD');
      }
    }

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
      <AddVisotor open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Visitor Basic Information</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
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
                      <HeaderCell>Student Name</HeaderCell>
                      <HeaderCell>Visitor Name</HeaderCell>
                      <HeaderCell>Phone No</HeaderCell>
                      <HeaderCell>Date</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allVisitors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.studentName}</TableCell>
                        <TableCell>{row.visitorName}</TableCell>
                        <TableCell>{row.phoneNumber}</TableCell>
                        <TableCell>{moment(row.dateTime).format('YYYY-MM-DD')}</TableCell>
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
