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
  Popover,
  Chip
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
import { render } from '@fullcalendar/core/preact';
import EditReservation from './EditReservation';

const StudentReservation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();
  const [studentData, setStudentsData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const Hos_Id = Cookies.get('_Id');
    if (Hos_Id) {
      setHostelId(Hos_Id);
    }
    fetchStudents(Hos_Id);
  }, [openAdd, openEdit]);

  const fetchStudents = async (hostelId) => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/sudent_reservation/getAllReservedStudents/${hostelId}`);
      setStudentsData(response?.data?.data);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
    setRowData(row);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleNavigate = (id) => {
    navigate(`/dashboard/student_reservation/view_profile/${id}`);
  };

  // Handle Delete Action Here
  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setDeleteStudentId(id);
  };

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
      field: 'roomNumber',
      headerName: 'Room Number',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {params.row.roomNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.roomType}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <Box onClick={() => handleNavigate(params.row.studentId._id)} sx={{ cursor: 'pointer' }}>
            <Typography variant="body1" fontWeight="bold">
              {params.row.studentId?.studentName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.studentId?.studentContact}
            </Typography>
          </Box>
        );
      }
    },

    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params) => {
        return params.row.studentId?.mailId;
      }
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
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const status = params.row.studentId?.status;
        const isActive = status === 'active';

        return (
          <Chip
            label={params.row.studentId?.status}
            color={isActive ? 'success' : 'error'}
            variant="outlined"
            size="small"
            style={{ textTransform: 'capitalize', fontWeight: 500 }}
          />
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
      <EditReservation open={openEdit} handleClose={handleCloseEdit} hostelId={hostelId} rowData={rowData} />
      <AddNewReservation open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Student Details</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
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
              {studentData && (
                <DataGrid
                  rows={studentData}
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
            handleOpenEdit();
            handleClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleDelete(rowData._id);
            handleClose();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'red' }} />
          Delete
        </MenuItem> */}
      </Popover>
    </>
  );
};

export default StudentReservation;
