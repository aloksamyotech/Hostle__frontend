import React from 'react';
import {
  Grid,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Container } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';

const Paymentslip = () => {
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();
  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [paymentData, setPaymentData] = useState(null);
  const [roomData, setRoomDetails] = useState(null);
  const [hostelData, setHostelDetails] = useState(null);
  const [isPrinted, setIsPrinted] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  console.log('payment id navigate ::', id);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/student_payment/paymentDataById/${id}`);
      console.log('---------- Payment details : ------>', response);
      setPaymentData(response.data.payment);
      setRoomDetails(response.data.assignBed);
      setHostelDetails(response.data.hostelData);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Error fetching payment details');
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  const handlePrint = () => {
    setIsPrinted(true);
    window.print();
  };

  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        console.log('ctx :', ctx);

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const downloadInvoice = async (paymentData, roomData, hostelData) => {
    const doc = new jsPDF();
    const topMargin = 7; // Space from top
    const logoWidth = 25;
    const logoHeight = 25;

    try {
      const base64Logo = await loadImageAsBase64('/HMS1.png');
      // Position the logo on the left (x = 14) and y = topMargin
      doc.addImage(base64Logo, 'PNG', 14, topMargin, logoWidth, logoHeight);
    } catch (error) {
      console.error('Image load failed:', error);
    }

    // Payment Slip Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Slip', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Date below header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${moment().format('DD/MM/YYYY')}`, doc.internal.pageSize.width / 2, 28, { align: 'center' });

    // Add bottom margin AFTER Date
    let currentY = 28 + 15;

    // Hostel Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Hostel Details', 14, currentY);
    currentY += 6;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${hostelData?.hostelName}`, 14, (currentY += 6));
    doc.text(`Contact: ${hostelData?.ownerPhoneNumber}`, 14, (currentY += 6));
    doc.text(`Address: ${hostelData?.address}`, 14, (currentY += 6));

    currentY += 10;

    // Student Details Heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Student Details', 14, currentY);

    // Room Details Heading (on the right)
    doc.text('Room Details', 110, currentY);

    currentY += 6;

    const leftX = 14;
    const rightX = 110;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.text(`Student Name: ${paymentData?.studentId?.studentName || 'N/A'}`, leftX, (currentY += 6));
    doc.text(`Room No: ${roomData?.roomNumber || 'N/A'}`, rightX, currentY);

    doc.text(`Contact No: ${paymentData?.studentId?.studentContact || 'N/A'}`, leftX, (currentY += 6));
    doc.text(`Room Type: ${roomData?.roomType || 'N/A'}`, rightX, currentY);

    doc.text(`Address: ${paymentData?.studentId?.address || 'N/A'}`, leftX, (currentY += 6));
    doc.text(`Bed No: ${roomData?.bedNumber || 'N/A'}`, rightX, currentY);

    // Payment Details Table
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Details', 14, currentY);
    currentY += 6;

    const tableBody = [
      ['Total Rent', `Rs ${paymentData?.totalRent}`],
      ['Advance Amount', `Rs ${paymentData?.advanceAmount ?? 0} `],
      ['Discount', `Rs ${paymentData?.discount ?? 0} `],
      ['Final Total Rent', `Rs ${paymentData?.finalTotalRent}`],
      ['Paid Amount', ` Rs ${paymentData?.paymentAmount}`],
      ['Pending Amount', ` Rs ${paymentData?.remainingAmount}`],
      ['Payment Method', paymentData?.paymentMethod || 'N/A'],
      ['Date', paymentData?.date ? moment(paymentData.date).format('DD/MM/YYYY') : 'N/A']
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Description', 'Amount (Rs)']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0], 
        textColor: 255 
      },
      styles: {
        fontSize: 11,
        cellPadding: 3,
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' }
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your payment!', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    // Save
    doc.save('payment-slip.pdf');
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          height: '30px',
          width: '100%',
          display: 'flex',
          borderRadius: '10px',
          justifyContent: 'end',
          alignItems: 'center',
          padding: '0 25px',
          mb: '20px'
        }}
      >
        <Button variant="contained" color="primary" size="small" onClick={() => navigate(-1)} startIcon={<ArrowBackIosIcon />}>
          Back
        </Button>
      </Box>

      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h3" align="center" gutterBottom>
              Payment Slip
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Date: {currentDate}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Typography variant="h4" gutterBottom>
              Hostel Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Name:</strong> {hostelData?.hostelName}
                </Typography>
                <Typography>
                  <strong>Contact:</strong> {hostelData?.ownerPhoneNumber}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Address:</strong> {hostelData?.address}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Student Details
                </Typography>
                <Typography>
                  <strong>Name:</strong> {paymentData?.studentId?.studentName}
                </Typography>
                <Typography>
                  <strong>Contact No:</strong> {paymentData?.studentId?.studentContact}
                </Typography>
                <Typography>
                  <strong>Address:</strong>
                  {paymentData?.studentId?.address}
                </Typography>
              </Grid>

              {/* Room Details - Right */}
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Room Details
                </Typography>
                <Typography>
                  <strong>Room No:</strong>
                  {roomData?.roomNumber}
                </Typography>
                <Typography>
                  <strong>Room Type:</strong> {roomData?.roomType}
                </Typography>
                <Typography>
                  <strong>Bed No:</strong> {roomData?.bedNumber}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h4" gutterBottom>
              Payment Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount (₹)</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Total Rent</strong>
                    </TableCell>
                    <TableCell>₹ {paymentData?.totalRent} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {' '}
                      <strong>Advance Amount</strong>
                    </TableCell>
                    <TableCell>₹ {paymentData?.advanceAmount || 0}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      {' '}
                      <strong>Discount</strong>
                    </TableCell>
                    <TableCell>₹ {paymentData?.discount || 0}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      {' '}
                      <strong>Final Total Rent</strong>
                    </TableCell>
                    <TableCell>₹ {paymentData?.finalTotalRent} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {' '}
                      <strong>Paid Amount</strong>
                    </TableCell>
                    <TableCell> ₹ {paymentData?.paymentAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {' '}
                      <strong>Pending Amount</strong>
                    </TableCell>
                    <TableCell> ₹ {paymentData?.remainingAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Payment Method</strong>
                    </TableCell>
                    <TableCell>{paymentData?.paymentMethod || '- -'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>{moment(paymentData?.date).format('DD/MM/YYYY') || '- -'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
          pr: 3
        }}
      >
        <Button variant="contained" color="primary" onClick={() => downloadInvoice(paymentData, roomData, hostelData)}>
          Print
        </Button>
      </Box>
    </Container>
  );
};

export default Paymentslip;
