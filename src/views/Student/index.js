import { Stack, Button, Container, Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,Dialog, DialogTitle, DialogContent, DialogActions, TablePagination } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import AddStudent from './AddStudent';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useState,useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Student = () => {

  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  
  const handleOpenAdd = () => {
    setOpenAdd(true);
    setEditStudent(null);
  };

  const handleCloseAdd = () =>{
    setOpenAdd(false);
    fetchStudentData(adminId);
  }

  //Navigate On View Page
  const handleNavigate = (id) => {
    navigate(`/dashboard/student/view/${id}`);
  };

  //Get Admin Obj Id Which is Seted In Cookies
  useEffect(()=>{
    const AdminId = Cookies.get('_Id');		
      if(AdminId){
        setAdminId(AdminId);
      }
      fetchStudentData(AdminId);
  },[]);

  //Get All Students Data Here 
  const fetchStudentData = async (adminId) => {
    try {
      console.log("API call on This URL=>",`${REACT_APP_BACKEND_URL}/student/list/${adminId}`);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student/list/${adminId}`,{
        headers : {
          'Authorization': `Bearer ${Cookies.get('Admin_Token')}`,
        }
      });
     
      console.log("response==>",response);
      setStudentData(response.data.result);
      setTotalCount(response.data.totalRecodes);
      
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  console.log("studentData===>",studentData);

  //Handle  Edit Action Here
  const handleEdit = (id) => {
    console.log(`Edit clicked for ID: ${id}`);
    const student = studentData.find(student => student._id === id);
    console.log("set student for edit=>",student);
    setOpenAdd(true);
    setEditStudent(student);
  };
  console.log("editStudent=>",editStudent);
  
   //Handle Delete Action Here
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
      let response = await axios.delete(`${REACT_APP_BACKEND_URL}/student/delete/${deleteStudentId}`,{
        headers: {
          'Authorization': `Bearer ${Cookies.get('Admin_Token')}`,
        }
      });
      console.log("response=>",response);
      setOpenDeleteDialog(false);
      fetchStudentData(adminId);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Handle Pages
  const handleChangePage = (event, newPage) => {
    console.log("New Page:", newPage);
    setPage(newPage); 
  };

  // Handle Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <>
      <AddStudent open={openAdd} handleClose={handleCloseAdd} editStudentData={editStudent} adminid={adminId}/>
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Resident Basic Information</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STUHOS-Id</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Email Id</TableCell>
                      <TableCell>Phone No</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                          onClick={() => handleNavigate(row._id)}
                        >{row.studentHosId}</TableCell>
                        <TableCell><Typography variant="body2">{row.firstname} {row.lastname}</Typography></TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phonenumber}</TableCell>
                        <TableCell>{row.city}</TableCell>
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
        </TableStyle>
      </Container>

      {/*-------------------- Dialog for Delete ----------------- */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle variant="h4">Delete Administrator</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete this Student?
        </Typography>
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
    </>
  );
};
export default Student;



