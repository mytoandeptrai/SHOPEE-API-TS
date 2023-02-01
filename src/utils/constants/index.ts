const APP_CONSTANTS = {
  apiPrefix: '',
  params: 'params',
  query: 'query',
  body: 'body',
  file: 'file',
  service: 'express-template',
};

const DEFAULT_PAGING = {
  CURRENT_PAGE: 1,
  LIMIT_PER_PAGE: 30,
};

const SORT_BY = ['createdAt', 'view', 'sold', 'price'];
const ORDER = ['desc', 'asc'];

export { APP_CONSTANTS, DEFAULT_PAGING, SORT_BY, ORDER };
