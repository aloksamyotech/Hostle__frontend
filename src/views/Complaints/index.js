import { useState, useEffect } from 'react';
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
  Popover,
  Chip
} from '@mui/material';
import Iconify from '../../ui-component/iconify';
import AddComplaint from './AddComplaint';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import { styled } from '@mui/material/styles';
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

const ResidentComplaints = () => {
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [editComplaint, setEditComplaint] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState();

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchAllComplaint(hostelId);
    setEditComplaint(null);
  };

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(() => {
    const HosId = Cookies.get('_Id');
    if (HosId) {
      setHostelId(HosId);
    }
    fetchAllComplaint(HosId);
  }, []);
  console.log('hostelId ===>', hostelId);

  // Fetch All Complaints Here
  const fetchAllComplaint = async (hostelId) => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/student_complaint/index/${hostelId}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_complaint/index/${hostelId}`, {});
      console.log('complaint response ===>', response);
      setAllComplaints(response.data.result);
      setTotalCount(response.data.totalRecodes);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };
  console.log('allComplaints=>', allComplaints);

  // Handle Edit Action Here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    setOpenAdd(true);
    let complaint = allComplaints.find((complaint) => complaint._id === id);
    console.log('complaint==>', complaint);
    setEditComplaint(complaint);
  };
  console.log('editComplaint=>', editComplaint);

  // Handle Delete Action Here
  const handleDelete = (id) => {
    console.log(`Delete clicked for ID: ${id}`);
    setOpenDeleteDialog(true);
    setDeleteStudentId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('URL =>', `${REACT_APP_BACKEND_URL}/student_complaint/deleteData/${deleteStudentId}`);
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/student_complaint/deleteData/${deleteStudentId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Admin_Token')}`
        }
      });
      console.log('delete =====> response =====>', response);

      setOpenDeleteDialog(false);
      fetchAllComplaint(hostelId);
    } catch (error) {
      console.error('Error deleting complaint:', error);
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
      headerName: 'Name',
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
      headerName: 'Room Number',
      flex: 1,
      renderCell: (params) => {
        return params.row.roomData?.roomNumber;
      }
    },
    {
      field: 'datetime',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return moment(params.row.datetime).format('YYYY-MM-DD');
      }
    },
    {
      field: 'problemDescription',
      headerName: 'Problem Description',
      flex: 2
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        let color = 'default';
        let label = '';

        switch (params.value) {
          case 'register':
            color = 'info';
            label = 'Registered';
            break;
          case 'in progress':
            color = 'warning';
            label = 'In Progress';
            break;
          case 'complete':
            color = 'success';
            label = 'Completed';
            break;
          default:
            color = 'default';
            label = params.value;
        }

        return <Chip label={label} color={color} variant="outlined" />;
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
      <AddComplaint open={openAdd} handleClose={handleCloseAdd} hostelId={hostelId} editComplaint={editComplaint} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h3">Student Complaint</Typography>
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
                      <HeaderCell>Student Contact Details</HeaderCell>
                      <HeaderCell>Room No</HeaderCell>
                      <HeaderCell>Date</HeaderCell>
                      <HeaderCell>Complaint Discription</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allComplaints.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {row.studentName}
                          <br />
                          {row.studentPhoneNo}{' '}
                        </TableCell>
                        <TableCell>{row.roomNumber}</TableCell>
                        <TableCell>{moment(row.datetime).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{row.problemDescription}</TableCell>
                        <TableCell>{row.status}</TableCell>
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
              {allComplaints && (
                <DataGrid
                  rows={allComplaints}
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
        <DialogTitle variant="h4">Delete Complaint</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this Complaint Details?</Typography>
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

export default ResidentComplaints;
