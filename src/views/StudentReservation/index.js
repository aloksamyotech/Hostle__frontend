import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  TextField,
  Typography,
  Box,
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
  TablePagination,
  Tab,
  Tabs,
  MenuItem,
  Popover
} from '@mui/material';
import Iconify from '../../ui-component/iconify';
import AddNewReservation from './AddNewReservation';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import Switch from '@mui/material/Switch';
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

const StudentReservation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [studentData, setStudentsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchReserveStudentData(Hos_Id);
  }, []);

  // Fetch All Student Data Here
  const fetchReserveStudentData = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/index/${hostelId}`);
      console.log('------ fetchReserveStudentData response ----------> ', response);

      const students = response.data.result;
      setStudentsData(students);
      setTotalCount(response.data.totalRecodes);

      const initialStatus = {};
      students.forEach((student) => {
        initialStatus[student._id] = student.status === 'active';
      });
      setStatus(initialStatus);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchReserveStudentData(hostelId);
    setEditStudent(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNavigate = (id) => {
    navigate(`/dashboard/student_reservation/view_profile/${id}`);
  };

  // Handle Edit Action Here
  const handleEdit = (id) => {
    setOpenAdd(true);
    let student = studentData.find((student) => student._id === id);
    setEditStudent(student);
  };

  // Handle Delete Action Here
  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setDeleteStudentId(id);
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

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${REACT_APP_BACKEND_URL}/sudent_reservation/deleteData/${deleteStudentId}`);
      setOpenDeleteDialog(false);
      fetchReserveStudentData(hostelId);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // For Filter Search Input
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

  const filteredData = studentData.filter(generalFilter);
  console.log('filteredData : =======>', filteredData);

  const handleStatusToggle = async (id) => {
    const newStatus = !status[id];
    console.log('on id =>id', id, 'status=>', newStatus);
    // if(newStatus){
    //   status = 'active'
    // }else{
    //   status = 'deactive'
    // }
    try {
      console.log('url up =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/updateStatus/${id}`, {
        status: newStatus ? 'active' : 'deactive'
      });
      const response = await axios.put(`${REACT_APP_BACKEND_URL}/sudent_reservation/updateStatus/${id}`, {
        status: newStatus ? 'active' : 'deactive'
      });
      console.log('url down =>', `${REACT_APP_BACKEND_URL}/sudent_reservation/updateStatus/${id}`, {
        status: newStatus ? 'active' : 'deactive'
      });
      console.log('response     ===========>   ', response);
      setStatus((prevStatus) => ({ ...prevStatus, [id]: newStatus }));
      console.log('on id =========>id', id, 'status=>', newStatus);
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const columns = [
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Box onClick={() => handleNavigate(params.row._id)}>{params.value}</Box>
          </Box>
        );
      }
    },
    {
      field: 'studentPhoneNo',
      headerName: 'Student PhoneNo',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params.value).format('DD-MM-YYYY')}</Box>;
      }
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{moment(params.value).format('DD-MM-YYYY')}</Box>;
      }
    },
    {
      field: 'address',
      headerName: 'Address',
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
      <AddNewReservation open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editStudent={editStudent} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Student Details</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
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

        {/* <TableStyle>
          <Box width="100%" sx={{ mt: '10px' }}>
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Student Contact Details</HeaderCell>
                      <HeaderCell>Room No</HeaderCell>
                      <HeaderCell>Start Date</HeaderCell>
                      <HeaderCell>End Date</HeaderCell>
                      <HeaderCell>Address</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row._id}>
                        <TableCell style={{ cursor: 'pointer' }} onClick={() => handleNavigate(row._id)}>
                          <span style={{ textDecoration: 'underline', color: 'blue' }}>{row.studentName}</span>
                          <br />
                          {row.email}
                          <br />
                          {row.studentPhoneNo}
                        </TableCell>
                        <TableCell>{moment(row.startDate).format('DD-MM-YYYY')}</TableCell>
                        <TableCell>{moment(row.endDate).format('DD-MM-YYYY')}</TableCell>
                        <TableCell>{row.roomNumber}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', wordWrap: 'normal' }}>
                          {row.city} {row.state} {row.address}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <IconButton onClick={() => handleEdit(row._id)} aria-label="edit" style={{ color: 'green' }}>
                              <EditOutlined />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row._id)} aria-label="delete" style={{ color: 'red' }}>
                              <DeleteOutline />
                            </IconButton>
                            <Switch checked={status[row._id]} color="primary" onChange={() => handleStatusToggle(row._id)} />
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

      {/*-------------------- Dialog for Delete ----------------- */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle variant="h4">Delete Administrator</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Student Details?</Typography>
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

export default StudentReservation;
