// validationSchemas.js
import { Discount } from '@mui/icons-material';
import * as Yup from 'yup';

const FILE_SIZE = 1024 * 1024; // 1 MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

export const administratorValidationSchema = Yup.object({
  hostelId: Yup.string().required('Hostel Id is required'),
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .required('Last name is required'),
  // email: Yup.string().email('Invalid email').required('Email is required'),
  // password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  aadharCard: Yup.string()
    .matches(/^\d{12}$/, 'Aadhar Card ID must be exactly 12 digits')
    .required('Aadhar Card ID is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  photo: Yup.string().required('Photo is required')
});

export const addAdminValidationSchema = Yup.object({
  hostelId: Yup.string().required('Hostel is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  aadharCard: Yup.string().required('Aadhar card is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  photo: Yup.mixed().required('Photo is required')
});

export const editAdminValidationSchema = Yup.object({
  hostelId: Yup.string().required('Hostel is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  aadharCard: Yup.string().required('Aadhar card is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required')
});

// export const addStudentValidationSchema = Yup.object({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   email: Yup.string().email('Invalid email format').required('Email is required'),
//   password: Yup.string().required('Password is required'),
//   dateOfBirth: Yup.string().required('Date of birth is required'),
//   gender: Yup.string().required('Gender is required'),
//   phoneNumber: Yup.string().required('Phone number is required'),
//   aadharCardId: Yup.string().required('Aadhar card is required'),
//   state: Yup.string().required('State is required'),
//   city: Yup.string().required('City is required'),
//   address: Yup.string().required('Address is required'),
//   photo: Yup.mixed().required('Photo is required'),
//   studentHosId: Yup.mixed().required('Student Hostel Id is required'),
// });

// export const editStudentValidationSchema = Yup.object({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   dateOfBirth: Yup.string().required('Date of birth is required'),
//   gender: Yup.string().required('Gender is required'),
//   phoneNumber: Yup.string().required('Phone number is required'),
//   aadharCardId: Yup.string().required('Aadhar card is required'),
//   state: Yup.string().required('State is required'),
//   city: Yup.string().required('City is required'),
//   address: Yup.string().required('Address is required'),
//   studentHosId: Yup.mixed().required('Student Hostel Id is required'),
// });

export const studentValidationSchema = Yup.object({
  // hostelName:  Yup.string().required('hostelName is required'),
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .required('Last name is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  aadharCardId: Yup.string()
    .matches(/^\d{12}$/, 'Aadhar Card ID must be exactly 12 digits')
    .required('Aadhar Card ID is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  photo: Yup.string().required('Photo is required'),
  studentHosId: Yup.string().required('Student Hostel Id is required')
});

export const hostelValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  // password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number'),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  uniqueCode: Yup.string().required('UniqueCode is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  photo: Yup.string().required('Photo is required'),
  noOfRoom: Yup.string().required('No of Room is required')
});

export const hostelNewValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Hostel Name must contain only letters and spaces')
    .max(50, 'Hostel Name must be at most 50 characters')
    .required('Hostel Name is required'),
  hostelPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Owner Name must contain only letters and spaces')
    .max(50, 'Owner Name must be at most 50 characters')
    .required('Owner Name is required'),
  ownerPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().max(20, 'Password must be at most 20 characters').required('Password is required'),
  address: Yup.string().max(150, 'Address must be at most 150 characters').required('Address is required')
  // state: Yup.string().required('State is required'),
  // city: Yup.string().required('City is required'),
  // hostelphoto: Yup.string().required('Photo is required'),
  // aadharphoto: Yup.string().required('Photo is required')
});

export const editHostelValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Hostel Name must contain only letters and spaces')
    .max(50, 'Hostel Name must be at most 50 characters')
    .required('Hostel Name is required'),
  hostelPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Owner Name must contain only letters and spaces')
    .max(50, 'Owner Name must be at most 50 characters')
    .required('Owner Name is required'),
  ownerPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required')
  // hostelphoto: Yup.string().required('Photo is required'),
  // aadharphoto: Yup.string().required('Photo is required')
});

export const roomValidationSchema = Yup.object({
  roomType: Yup.string().required('Select Room Type is required'),
  roomNumber: Yup.string().max(20, 'Room number must not exceed 20 characters').required('Room number is required'),
  noOfBeds: Yup.number()
    .typeError('No of Beds must be a number')
    .positive('No of Beds must be a positive number')
    .max(10, 'No of Beds cannot be more than 10')
    .required('No of Beds is required'),
  roomPrice: Yup.number()
    .typeError('Room price must be a number')
    .positive('Room price must be a positive number')
    .max(100000, 'Room price cannot exceed ₹1,00,000')
    .required('Room price is required')
});

export const roomEditValidationSchema = (occupiedBeds) =>
  Yup.object({
    roomType: Yup.string().required('Select Room Type is required'),
    roomNumber: Yup.string().max(20, 'Room number must not exceed 20 characters').required('Room number is required'),
    noOfBeds: Yup.number()
      .typeError('No of Beds must be a number')
      .positive('No of Beds must be a positive number')
      .max(10, 'No of Beds cannot be more than 10')
      .required('No of Beds is required')
      .test('beds-not-less-than-occupied', `No of Beds cannot be less than occupied beds (${occupiedBeds})`, function (value) {
        if (value === undefined || value === null) return false;
        return value > occupiedBeds;
      }),
    roomPrice: Yup.number()
      .typeError('Room price must be a number')
      .positive('Room price must be a positive number')
      .max(100000, 'Room price cannot exceed ₹1,00,000')
      .required('Room price is required')
  });

export const roomTypeValidationSchema = Yup.object({
  roomType: Yup.string().required('Room Type is required'),
  roomCategory: Yup.mixed().required('Room CAtegory is required')
});

export const addStudentValidationSchema = Yup.object({
  studentName: Yup.string().required('Student Name is required'),
  studentPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  fathersName: Yup.string().required('Fathers Name is required'),
  fathersPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  studentphoto: Yup.string().required('Student Photo is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  aadharcardphoto: Yup.string().required('Student AadharCard Photo is required'),
  roomNumber: Yup.string().required('Select Room is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required').min(Yup.ref('startDate'), 'End Date must be after Start Date'),
  isLibrary: Yup.string(),
  isFood: Yup.string(),
  libraryAmount: Yup.number().nullable().integer('Library Amount must be an integer'),
  foodAmount: Yup.number().nullable().integer('Food Amount must be an integer'),
  hostelRent: Yup.number().required('Hostel Rent is required').integer('Hostel Rent must be an integer'),
  advancePayment: Yup.number().required('Advance Payment is required').integer('Advance Payment must be an integer')
});

export const addReservedBedValidationSchema = Yup.object({
  roomType: Yup.string().required('Room Type is required'),
  roomNumber: Yup.string().required('Room No is required'),
  bedNumber: Yup.string().required('Bed No is required'),
  roomRent: Yup.number().typeError('Room Price must be a number').required('Room Price is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().min(Yup.ref('startDate'), 'End Date cannot be before Start Date').required('End Date is required'),
  stayMonths: Yup.number().typeError('Account of Stay Months must be a number').required('Account of Stay Months is required'),

  totalRent: Yup.number().typeError('Total Rent must be a number').required('Total Rent is required'),
  advanceAmount: Yup.number()
    .typeError('Advance Amount must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .test('is-valid-advance', 'Advance Amount must be positive and not greater than Total Rent', function (value) {
      const { totalRent } = this.parent;
      if (value == null) return true;
      return value > 0 && value <= totalRent;
    }),

  discount: Yup.number()
    .typeError('Discount Amount must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .test('is-valid-discont', 'Discount Amount must be positive and not greater than Total Rent', function (value) {
      const { totalRent } = this.parent;
      if (value == null) return true;
      return value > 0 && value <= totalRent;
    }),

  finalTotalRent: Yup.number()
    .typeError('Final Total Amount must be a number')
    .required('Final Total Amount is required')
    .positive('Amount must be positive')
    .max(Yup.ref('totalRent'), 'Final Total cannot be greater than Total Rent'),

  studentName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Student Name can only contain letters')
    .max(30, 'Student Name must be at most 30 characters')
    .required('Student Name is required'),

  studentContact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Contact No must be exactly 10 digits')
    .required('Contact No is required'),

  fatherName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Father Name can only contain letters')
    .max(30, 'Father Name must be at most 30 characters')
    .required('Father Name is required'),

  fatherContact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Father Contact No must be exactly 10 digits')
    .required('Father Contact No is required'),

  // guardianName: Yup.string()
  //   .matches(/^[A-Za-z\s]+$/, 'Guardian Name can only contain letters')
  //   .max(30, 'Guardian Name must be at most 30 characters')
  //   .required('Guardian Name is required'),

  // guardianContactNo: Yup.string()
  //   .matches(/^[0-9]{10}$/, 'Guardian Contact No must be exactly 10 digits')
  //   .required('Guardian Contact No is required'),

  // guardiansAddress: Yup.string().max(100, 'Address must be at most 100 characters').required('Address is required'),

  dob: Yup.date().max(new Date(), 'Date of Birth cannot be a future date').required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  mailId: Yup.string().required('Main ID is required'),
  // courseOccupation: Yup.string().max(100, 'Course Occupation must be at most 100 characters').required('Course / Occupation is required'),
  address: Yup.string().max(100, 'Address must be at most 100 characters').required('Address is required')
});

export const editReservedBedValidationSchema = Yup.object({
  roomCategory: Yup.string().required('Room Type is required'),
  roomType: Yup.string().required('Room Type is required'),
  roomNumber: Yup.string().required('Room No is required'),
  bedNumber: Yup.string().required('Bed No is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().min(Yup.ref('startDate'), 'End Date cannot be before Start Date').required('End Date is required')
});

export const editStudentValidationSchema = Yup.object({
  studentName: Yup.string().required('Student Name is required'),
  studentPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  fathersName: Yup.string().required('Fathers Name is required'),
  fathersPhoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  roomNumber: Yup.string().required('Select Room is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required').min(Yup.ref('startDate'), 'End Date must be after Start Date'),
  isLibrary: Yup.string(),
  isFood: Yup.string(),
  libraryAmount: Yup.number().nullable().integer('Library Amount must be an integer'),
  foodAmount: Yup.number().nullable().integer('Food Amount must be an integer'),
  hostelRent: Yup.number().required('Hostel Rent is required').integer('Hostel Rent must be an integer'),
  advancePayment: Yup.number().required('Advance Payment is required').integer('Advance Payment must be an integer')
});

export const studentComplaintValidationSchema = Yup.object({
  studentId: Yup.string().required('Student is required'),
  datetime: Yup.date().required('Date and time are required'),
  problemDescription: Yup.string().required('Problem Description is required'),
  status: Yup.string().required('Status is required')
});

export const visitorValidationSchema = Yup.object({
  studentId: Yup.string().required('Student is required'),
  visitorName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Visitor Name is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  dateTime: Yup.string().required('Date Time is required'),
  visitorduration: Yup.number()
    .typeError('Visit Duration must be a number')
    .max(24, 'Visit Duration cannot be more than 24 hours')
    .required('Visit Duration is required')
});

const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

export const attendenceValidationSchema = Yup.object({
  studentHosId: Yup.string().required('Student-Hostel ID is required'),
  date: Yup.string()
    .required('Date is required')
    .test('is-today', 'Date must be today', function (value) {
      return value === today;
    }),
  outTime: Yup.string().required('Out Time is required')
  // inTime: Yup.string().required('In Time is required'),
});

export const productValidationSchema = Yup.object({
  productName: Yup.string().required('Product Name is required'),
  mesurment: Yup.string().required('Measurement is required')
});

export const productPurchesValidationSchema = Yup.object().shape({
  productName: Yup.string().required('Product is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .positive('Quantity must be a positive number'),
  price: Yup.number().typeError('Price must be a number').required('Price is required').positive('Price must be a positive number'),
  date: Yup.date().required('Date is required')
});

export const productConsumeValidationSchema = Yup.object().shape({
  productName: Yup.string().required('Product List is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .positive('Quantity must be a positive number'),
  date: Yup.date().required('Date is required')
});

export const addExpenseValidationSchema = Yup.object().shape({
  expenseTitle: Yup.string().required('Expense Title is required'),
  price: Yup.number().required('Price is required').positive('Price must be a positive number'),
  date: Yup.date().required('Date is required')
  // billPhoto: Yup.mixed().required('Bill Photo is required')
});

export const editExpenseValidationSchema = Yup.object().shape({
  expenseTitle: Yup.string().required('Expense Title is required'),
  price: Yup.number().required('Price is required').positive('Price must be a positive number'),
  date: Yup.date().required('Date is required')
});

export const noticeValidationSchema = Yup.object().shape({
  noticeTitle: Yup.string().required('is required'),
  dateTime: Yup.date().required('Date Time is required'),
  description: Yup.string().required('Description is required')
});

export const weeklyFoodValidationSchema = Yup.object().shape({
  weekdays: Yup.string().required('Weekdays is required'),
  foodType: Yup.string().required('Food Type is required'),
  foodDescription: Yup.string().required('Food Description is required')
});

export const paymentValidationSchema = (remainingAmt) =>
  
  
  Yup.object({
    studentId: Yup.string().required('Student is required'),
    paymentMethod: Yup.string().required('Payment Method is required'),
    date: Yup.date().required('Date is required'),
    remainingAmount: Yup.string().required('Remaining Amount is required'),

    paymentAmount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Payment Amount is required')
      .test(
        'is-valid-paymentAmount',
        `Payment Amount must not be greater than Remaining Amount (${remainingAmt})`,
        function (value) {
          if (value === undefined || remainingAmt === undefined) return true;
          return value <= parseFloat(remainingAmt);
        }
      )
  });


