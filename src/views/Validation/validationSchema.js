// validationSchemas.js
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
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Hostel Name is required'),
  hostelPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Owner Name is required'),
  ownerPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  hostelphoto: Yup.string().required('Photo is required'),
  aadharphoto: Yup.string().required('Photo is required')
});

export const editHostelValidationSchema = Yup.object({
  hostelName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Hostel Name is required'),
  hostelPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  ownerName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Owner Name is required'),
  ownerPhoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  hostelphoto: Yup.string().required('Photo is required'),
  aadharphoto: Yup.string().required('Photo is required')
});

export const roomValidationSchema = Yup.object({
  roomCategory: Yup.string().required('Select Room Category is required'),
  roomType: Yup.string().required('Select Room Type is required'),
  roomNumber: Yup.string().required('Room number is required'),
  noOfBeds: Yup.number().required('No of Beds is required'),
  roomPrice: Yup.number().required('Room price is required'),
  roomphoto: Yup.mixed().required('Room Photos is required')
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
  datetime: Yup.date().required('Date and time are required'),
  problemDescription: Yup.string().required('Problem Description is required'),
  status: Yup.string().required('Status is required')
});

export const visitorValidationSchema = Yup.object({
  visitorName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Visitor Name is required'),
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number')
    .required('Phone Number is required'),
  dateTime: Yup.string().required('Date Time is required')
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
  date: Yup.date().required('Date is required'),
  billPhoto: Yup.mixed().required('Bill Photo is required')
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

export const paymentValidationSchema = Yup.object({
  // studentName: Yup.string().required('Student Name is required'),
  month: Yup.string().required('Month is required'),
  paymentDate: Yup.date().required('Date is required'),
  paymentType: Yup.string().required('Payment Method is required'),
  paymentAmount: Yup.number().positive('Amount must be positive').required('Payment Amount is required'),
  paymentAttachment: Yup.mixed().nullable()
});
