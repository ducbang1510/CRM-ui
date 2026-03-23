export interface DailySalesReport {
  pk?: number;
  reportDate?: string;
  totalRevenue?: number;
  totalOrders?: number;
  ordersCreated?: number;
  ordersApproved?: number;
  ordersDelivered?: number;
  ordersCanceled?: number;
  mongoFileId?: string;
  fileName?: string;
  status?: string;
  createdOn?: Date;
}
