import { Roles } from 'src/app/_models/roles.enum';
import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'mdi mdi-file',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.STUDENT,Roles.SUPERVISOR,Roles.SUPERADMIN],
    params:"",
    hasSub:false
  },
  {
    path: '',
    title: 'תפריט',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: [],
    role:[Roles.STUDENT,Roles.SUPERVISOR,Roles.SUPERADMIN],
    params:"",
    hasSub:false
  },
  {
    path: '/component/students',
    title: 'סטודנטים בקליניקות',
    icon: 'mdi mdi-account-box',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERADMIN],
    params:"",
    hasSub:true
  },
  {
    path: '/component/students',
    title: 'סטודנטים בקליניקה',
    icon: 'mdi mdi-account-box',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.STUDENT],
    params:"",
    hasSub:false
  },
  {
    path: '/component/supervisors',
    title: 'מנחים',
    icon: 'mdi mdi-message-bulleted',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERADMIN],
    params:"",
    hasSub:false
  },
  {
    path: '/component/legalCases',
    title: 'תיקים בקליניקות',
    icon: 'mdi mdi-view-carousel',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERADMIN],
    params:"",
    hasSub:true
  },
  {
    path: '/component/legalCases',
    title: 'תיקים בקליניקה',
    icon: 'mdi mdi-view-carousel',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERVISOR],
    params:"",
    hasSub:true
  },
  {
    path: '/component/legalCases',
    title: 'תיקים שלי',
    icon: 'mdi mdi-view-carousel',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.STUDENT],
    params:"",
    hasSub:true
  },
  {
    path: '/component/clinics',
    title: 'קליניקות',
    icon: 'mdi mdi-arrange-bring-to-front',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERADMIN],
    params:"",
    hasSub:false
  },
  {
    path: '/component/clinics',
    title: 'הקליניקה',
    icon: 'mdi mdi-arrange-bring-to-front',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.STUDENT,Roles.SUPERVISOR],
    params:"",
    hasSub:false
  },
  {
    path: '/component/modal',
    title: 'הצעות חקיקה',
    icon: 'mdi mdi-tablet',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERVISOR,Roles.SUPERADMIN],
    params:"",
    hasSub:false
  },
  {
    path: '/component/modal',
    title: 'הסעות',
    icon: 'mdi mdi-tablet',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERVISOR,Roles.STUDENT],
    params:"",
    hasSub:false
  },


  {
    path: '/component/pagination',
    title: 'מחקר',
    icon: 'mdi mdi-backburger',
    class: '',
    extralink: false,
    submenu: [],
    role:[Roles.SUPERVISOR,Roles.STUDENT],
    params:"",
    hasSub:false
  }
    /*
  {
    path: '/component/poptool',
    title: 'הסעות',
    icon: 'mdi mdi-image-filter-vintage',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/progressbar',
    title: 'Progressbar',
    icon: 'mdi mdi-poll',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/rating',
    title: 'Ratings',
    icon: 'mdi mdi-bandcamp',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/tabs',
    title: 'Tabs',
    icon: 'mdi mdi-sort-variant',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/timepicker',
    title: 'Timepicker',
    icon: 'mdi mdi-calendar-clock',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/buttons',
    title: 'Button',
    icon: 'mdi mdi-blur-radial',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/card',
    title: 'Card',
    icon: 'mdi mdi-arrange-bring-forward',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/toast',
    title: 'Toast',
    icon: 'mdi mdi-alert',
    class: '',
    extralink: false,
    submenu: []
  }
  */
];
