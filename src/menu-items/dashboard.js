// assets
import {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconUser,
  IconFileStack,
  IconNotification,
  IconMenu,
  IconCategory,
  IconReceipt,
  IconUserPlus

} from '@tabler/icons';

// constant
const icons = {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconUser,
  IconFileStack,
  IconNotification,
  IconMenu,
  IconCategory,
  IconReceipt,
  IconUserPlus
  
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  title: 'Dashboard-Menu',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Hostel Details',
      type: 'item',
      url: '/dashboard/hostel',
      icon: icons.IconNotebook,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Hostel Administrators',
      type: 'item',
      url: '/dashboard/administrator',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Student Details',
      type: 'item',
      url: '/dashboard/student',
      icon: icons.IconUser,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Room Details',
      type: 'item',
      url: '/dashboard/room',
      icon : icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: '05',
      title: 'Student Reservation',
      type: 'item',
      url: '/dashboard/student_reservation',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: '06',
      title: 'Resident Complaints',
      type: 'item',
      url: '/dashboard/complaints',
      icon : icons.IconFileStack,
      breadcrumbs: false
    },
    {
      id: '07',
      title: 'Visitor Details',
      type: 'item',
      url: '/dashboard/visitor',
      icon: icons.IconMail,
      breadcrumbs: false
    },
    // {
    //   id: '08',
    //   title: 'Resident Attendence',
    //   type: 'item',
    //   url: '/dashboard/attendence',
    //   icon: icons.IconChecklist,
    //   breadcrumbs: false
    // },
    {
      id: '08',
      title: 'Canteen Inventory',
      type: 'item',
      url: '/dashboard/canteen_inventory',
      icon: icons.IconMenu,
      breadcrumbs: false
    },
    {
      id: '09',
      title: 'Purchase Inventory',
      type: 'item',
      url: '/dashboard/purches_inventory',
      icon: icons.IconMenu,
      breadcrumbs: false
    },
    {
      id: '10',
      title: 'Consume Inventory',
      type: 'item',
      url: '/dashboard/consume_inventory',
      icon: icons.IconMenu,
      breadcrumbs: false
    },
    {
      id: '11',
      title: "Expenditure's",
      type: 'item',
      url: '/dashboard/expenditures',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: '12',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/payments',
      icon: icons.IconReceipt,
      breadcrumbs: false
    },
    {
      id: '13',
      title: 'Notice Board',
      type: 'item',
      url: '/dashboard/notice_board',
      icon: icons.IconNotification,
      breadcrumbs: false
    },
    {
      id: '14',
      title: 'Weekly Food Menu',
      type: 'item',
      url: '/dashboard/weekly_foodmenu',
      icon: icons.IconCategory,
      breadcrumbs: false
    }
  ]
};
export default dashboard;
