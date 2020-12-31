import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'mdi mdi-file',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'תפריט',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/component/students',
    title: 'סטודנטים',
    icon: 'mdi mdi-account-box',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/supervisors',
    title: 'מנחים',
    icon: 'mdi mdi-message-bulleted',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/legalCases',
    title: 'תיקים ',
    icon: 'mdi mdi-view-carousel',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/clinics',
    title: 'קליניקות',
    icon: 'mdi mdi-arrange-bring-to-front',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/modal',
    title: 'הצעות חקיקה',
    icon: 'mdi mdi-tablet',
    class: '',
    extralink: false,
    submenu: []
  },

  /*
  {
    path: '/component/pagination',
    title: 'מחקר',
    icon: 'mdi mdi-backburger',
    class: '',
    extralink: false,
    submenu: []
  },
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
