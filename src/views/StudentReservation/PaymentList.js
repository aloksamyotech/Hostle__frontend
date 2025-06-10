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
  DialogActions,
  TablePagination,
  Tab,
  Tabs
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import { EditOutlined, VisibilityOutlined, DeleteOutline } from '@mui/icons-material';
import { PaymentOutlined } from '@mui/icons-material';
import AddPayment from './AddPayment';
import { useState } from 'react';

const PaymentList = (props) => {
  const { studentPaymentData, paymentRecordsCount } = props;

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCloseAddPayment = () => {
    setOpenAddPayment(false);
  };

  const handlePayAgain = (id) => {
    setOpenAddPayment(true);
  };

  // Handle Pages
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows PerPage
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <AddPayment open={openAddPayment} handleClose={handleCloseAddPayment} />
      <TableStyle>
        <Box width="100%" sx={{ mt: '10px' }}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell>Pending Amount</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Attachment</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {studentPaymentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.paymentDate}</TableCell>
                      <TableCell>{row.paymentAmount}</TableCell>
                      <TableCell>{row.pendingAmmount}</TableCell>
                      <TableCell>{row.paymentType}</TableCell>
                      <TableCell>
                        {row.paymentAttachment && (
                          <img
                            src={`${REACT_APP_BACKEND_URL}/uploads/payment/${row.paymentAttachment}`}
                            alt="paymentAttachment"
                            style={{ width: 150, height: 150 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row">
                          <Button
                            onClick={() => handlePayAgain(row._id)}
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={row.pendingAmmount <= 0}
                          >
                            PayAgain
                          </Button>
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
        </Box>
      </TableStyle>
    </>
  );
};

export default PaymentList;
