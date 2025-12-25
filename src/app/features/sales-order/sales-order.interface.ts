export interface SalesOrder {
  assignedTo: string;
  contactName: string;
  description: string;
  subject: string;
  status: string;
  total: string;
  createdTime?: Date;
  creator?: string;
  pk?: number;
  updatedTime?: Date;
}

export interface FilterCriteria {
  assignedTo?: string;
  contactName?: string;
  createdTimeFrom?: object;
  createdTimeTo?: object;
  updatedTimeFrom?: object;
  updatedTimeTo?: object;
  subject?: string;
  status?: string;
}
