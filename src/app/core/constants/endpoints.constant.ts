import { environment } from '~environments/environment';

export const ENDPOINTS = {
  ai: {
    chat: `${environment.apiBaseUrl}/v1/ai/chat`,
  },
  auth: {
    authentication: `${environment.apiBaseUrl}/v1/authentication`,
    signin: `${environment.apiBaseUrl}/v1/authentication/signin`,
  },
  dashboard: {
    pipelineSummary: `${environment.apiBaseUrl}/v1/dashboard/pipeline-summary`,
    revenueTrend: `${environment.apiBaseUrl}/v1/dashboard/revenue-trend`,
    topUsers: `${environment.apiBaseUrl}/v1/dashboard/top-users`,
  },
  contact: {
    bulkDeleteContacts: `${environment.apiBaseUrl}/v1/contact/delete`,
    contact: `${environment.apiBaseUrl}/v1/contact`,
    contactList: `${environment.apiBaseUrl}/v1/contact/list`,
    contactNameList: `${environment.apiBaseUrl}/v1/contact/list/contact-name`,
    countContact: `${environment.apiBaseUrl}/v1/contact/count`,
    searchContact: `${environment.apiBaseUrl}/v1/contact/search`,
  },
  salesOrder: {
    bulkDeleteSalesOrders: `${environment.apiBaseUrl}/v1/sales-order/delete`,
    countSalesOrder: `${environment.apiBaseUrl}/v1/sales-order/count`,
    salesOrder: `${environment.apiBaseUrl}/v1/sales-order`,
    salesOrderList: `${environment.apiBaseUrl}/v1/sales-order/list`,
    searchSalesOrder: `${environment.apiBaseUrl}/v1/sales-order/search`,
  },
  product: {
    bulkDeleteProducts: `${environment.apiBaseUrl}/v1/product/delete`,
    product: `${environment.apiBaseUrl}/v1/product`,
    productList: `${environment.apiBaseUrl}/v1/product/list`,
  },
  file: {
    fileDelete: `${environment.apiBaseUrl}/v1/file/delete`,
    fileDownload: `${environment.apiBaseUrl}/v1/file/download`,
    fileList: `${environment.apiBaseUrl}/v1/file/list`,
    fileUpload: `${environment.apiBaseUrl}/v1/file/upload`,
  },
  note: {
    note: `${environment.apiBaseUrl}/v1/note`,
    noteList: `${environment.apiBaseUrl}/v1/note/list`,
    noteType: `${environment.apiBaseUrl}/v1/note/type`,
  },
  report: {
    dailySales: `${environment.apiBaseUrl}/v1/report/daily-sales`,
    dailySalesDownload: `${environment.apiBaseUrl}/v1/report/daily-sales/download`,
  },
  task: {
    myTasks: `${environment.apiBaseUrl}/v1/task/my`,
    task: `${environment.apiBaseUrl}/v1/task`,
    taskPriority: `${environment.apiBaseUrl}/v1/task/priority`,
    taskStatus: `${environment.apiBaseUrl}/v1/task/status`,
    taskSummary: `${environment.apiBaseUrl}/v1/task/summary`,
    taskType: `${environment.apiBaseUrl}/v1/task/type`,
  },
  notification: {
    list: `${environment.apiBaseUrl}/v1/notification`,
  },
  user: {
    createUser: `${environment.apiBaseUrl}/v1/user/create`,
    user: `${environment.apiBaseUrl}/v1/user`,
    userList: `${environment.apiBaseUrl}/v1/user/list`,
    userNamesList: `${environment.apiBaseUrl}/v1/user/list/name`,
  },
};
