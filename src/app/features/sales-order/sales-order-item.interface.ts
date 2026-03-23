export interface SalesOrderItem {
  pk?: number;
  salesOrderFk?: number;
  productFk: number;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  discount?: number;
  lineTotal?: number;
  sortOrder?: number;
  createdOn?: Date;
  updatedOn?: Date;
}
