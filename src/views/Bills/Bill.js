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
      img.crossOrigin = 'anonymous'; // Important for cross-origin issues
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

  const downloadInvoice = async (paymentData, roomData, hostelData, paymentDetails) => {
    console.log('handel download invoice', paymentData, roomData, hostelData, paymentDetails);

    const doc = new jsPDF();

    try {
      const topMargin = 5;

      const base64Logo = await loadImageAsBase64('/HMS1.png');
      doc.addImage(base64Logo, 'PNG', 14, 6 + topMargin, 30, 20);
    } catch (error) {
      console.error('Image load failed:', error);
    }

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Slip', doc.internal.pageSize.width - 14, 20, { align: 'right' });

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${moment().format('DD/MM/YYYY')}`, doc.internal.pageSize.width - 14, 28, { align: 'right' });

    let currentY = 40;

    // Hostel Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Hostel Details', 14, currentY);
    currentY += 6;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${hostelData?.hostelName}`, 14, (currentY += 6));
    doc.text(`Owner: ${hostelData?.ownerName}`, 14, (currentY += 6));
    doc.text(`Contact: ${hostelData?.ownerPhoneNumber}`, 14, (currentY += 6));
    doc.text(`Address: ${hostelData?.address}`, 14, (currentY += 6));

    // Student Details
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Student Details', 14, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${paymentData?.studentId?.studentName}`, 14, (currentY += 6));
    doc.text(`Contact No: ${paymentData?.studentId?.studentContact}`, 14, (currentY += 6));

    // Room Details
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Room Details', 14, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Room No: ${roomData?.roomNumber}`, 14, (currentY += 6));
    doc.text(`Room Type: ${roomData?.roomType}`, 14, (currentY += 6));
    doc.text(`Bed No: ${roomData?.bedNumber}`, 14, (currentY += 6));

    // Payment Details Table
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Details', 14, currentY);
    currentY += 6;

    const tableBody = [
      ['Total Rent', `Rs ${paymentData?.totalRent}`],
      ['Advance Amount', `Rs ${paymentData?.advanceAmount}`],
      ['Final Total Rent', `Rs ${paymentData?.finalTotalRent}`],
      ['Paid Amount', `Rs ${paymentData?.paymentAmount}`],
      ['Pending Amount', `Rs ${paymentData?.remainingAmount}`],
      ['Payment Method', paymentDetails?.paymentMethod || 'N/A'],
      ['Date', paymentDetails?.date ? moment(paymentDetails.date).format('DD/MM/YYYY') : 'N/A']
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Description', 'Amount (Rs)']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [33, 150, 243],
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

  // Static data
  const hostelDetails = {
    name: 'Sunrise Hostel',
    owner: 'Mr. Rajesh Kumar',
    contact: '+91 9876543210',
    address: '123 MG Road, Pune, Maharashtra'
  };

  const studentDetails = {
    name: 'Ankit Sharma',
    contact: '+91 9123456789'
  };

  const roomDetails = {
    roomNo: '203',
    roomType: 'AC Deluxe',
    bedNo: 'B2'
  };

  const paymentDetails = {
    totalRent: 15000,
    paidAmount: 10000,
    pendingAmount: 5000,
    paymentMethod: 'UPI',
    date: currentDate
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          //  backgroundColor: 'white',
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
            <Typography variant="h4" align="center" gutterBottom>
              Payment Slip
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Date: {currentDate}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Typography variant="h5" gutterBottom>
              Hostel Details
            </Typography>
            <Typography>Name: {hostelData?.hostelName}</Typography>

            <Typography>Owner: {hostelData?.ownerName}</Typography>
            <Typography>Contact: {hostelData?.ownerPhoneNumber}</Typography>
            <Typography>Address: {hostelData?.address}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom>
              Student Details
            </Typography>
            <Typography>Name: {paymentData?.studentId?.studentName}</Typography>
            <Typography>Contact No: {paymentData?.studentId?.studentContact}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom>
              Room Details
            </Typography>
            <Typography>Room No: {roomData?.roomNumber}</Typography>
            <Typography>Room Type: {roomData?.roomType}</Typography>
            <Typography>Bed No: {roomData?.bedNumber}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom>
              Payment Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Description</b>
                    </TableCell>
                    <TableCell>
                      <b>Amount (₹)</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Rent</TableCell>
                    <TableCell>₹ {paymentData?.totalRent} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Advance Amount</TableCell>
                    <TableCell>₹ {paymentData?.advanceAmount} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Final Total Rent</TableCell>
                    <TableCell>₹ {paymentData?.finalTotalRent} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell> ₹ {paymentData?.paymentAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pending Amount</TableCell>
                    <TableCell> ₹ {paymentData?.remainingAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>{paymentDetails?.paymentMethod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>{paymentDetails?.date}</TableCell>
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
        <Button variant="contained" color="primary" onClick={() => downloadInvoice(paymentData, roomData, hostelData, paymentDetails)}>
          Print
        </Button>
      </Box>
    </Container>
  );
};

export default Paymentslip;
