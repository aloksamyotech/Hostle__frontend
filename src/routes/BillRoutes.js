import Paymentslip from 'views/Bills/Bill';

const BillRoute = {
  children: [
    {
      path: 'paymentslip/view/:id',
      element: <Paymentslip />
    }
  ]
};

export default BillRoute;
