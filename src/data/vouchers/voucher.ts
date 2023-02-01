export interface IVouchersType {
  code: string;
  value: number;
  title: string;
  expirationDate: number;
  usersUsed: any[];
  usersSave: any[];
  isPublic: boolean;
  isFreeship: boolean;
  expired: boolean;
}

const vouchers: IVouchersType[] = [
  {
    code: 'GIAMGIA99K',
    value: 99000,
    title: 'MÃ GIẢM GIÁ 99K',
    expirationDate: 1680921920000,
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expired: false,
  },
  {
    code: 'FREESHIP20K',
    value: 20000,
    title: 'MÃ GIẢM GIÁ 20K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'FREESHIP30K',
    value: 30000,
    title: 'MÃ GIẢM GIÁ 30K',
    usersUsed: [],
    usersSave: [],
    expirationDate: 1680921920000,
    isPublic: true,
    isFreeship: false,
    expired: false,
  },
  {
    code: 'GIAMGIA49K',
    value: 49000,
    title: 'MÃ GIẢM GIÁ 49K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'GIAMGIA149K',
    value: 149000,
    title: 'MÃ GIẢM GIÁ 149K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'GIAMGIA200K',
    value: 200000,
    title: 'MÃ GIẢM GIÁ 149K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'FREESHIP33K',
    value: 33000,
    title: 'MÃ GIẢM GIÁ 33K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'FREESHIP15K',
    value: 15000,
    title: 'MÃ GIẢM GIÁ 15K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'GIAMGIA500K',
    value: 500000,
    title: 'MÃ GIẢM GIÁ 500K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
  {
    code: 'FREESHIP300K',
    value: 300000,
    title: 'MÃ GIẢM GIÁ 300K',
    usersUsed: [],
    usersSave: [],
    isPublic: true,
    isFreeship: false,
    expirationDate: 1680921920000,
    expired: false,
  },
];

export default vouchers;
