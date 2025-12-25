import { environment } from '~environments/environment';

export const ENDPOINTS = {
  auth: {
    authentication: `${environment.apiBaseUrl}/v1/authentication`,
    signin: `${environment.apiBaseUrl}/v1/authentication/signin`,
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
  user: {
    createUser: `${environment.apiBaseUrl}/v1/user/create`,
    user: `${environment.apiBaseUrl}/v1/user`,
    userList: `${environment.apiBaseUrl}/v1/user/list`,
    userNamesList: `${environment.apiBaseUrl}/v1/user/list/name`,
  },
};
