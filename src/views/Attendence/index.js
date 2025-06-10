import { useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddAttendence from './AddAttendence';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
// ----------------------------------------------------------------------
const attendenceData = [
  {
    id: 1,
    hostelName: 'MahaveerSeve Dham',
    studentName: 'John Doe',
    date: '10-10-2024',
    outTime: '08:15',
    inTime: '07:30'
  }
];
const Attendence = () => {
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    setOpenAdd(true);
  };

  return (
    <>
      <AddAttendence open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Resident Attendence</Typography>
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
                      <TableCell>Hostel Name</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Out-Time</TableCell>
                      <TableCell>In-Time</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendenceData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.hostelName}</TableCell>
                        <TableCell>{row.studentName}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.outTime}</TableCell>
                        <TableCell>{row.inTime}</TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <IconButton onClick={() => handleEdit(row.id)} aria-label="edit" style={{ color: 'green' }}>
                              <EditOutlined />
                            </IconButton>
                            {/* <IconButton onClick={() => handleDelete(row.id)} aria-label="delete" style={{ color: 'red' }}>
                              <DeleteOutline />
                            </IconButton> */}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </TableStyle>
      </Container>

      {/*-------------------- Dialog for Delete ----------------- */}

      {/* <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle variant="h4">Delete Administrator</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete this Room Details?
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
      </Dialog> */}
    </>
  );
};
export default Attendence;
