export interface Contact {
  address: string;
  assignedTo: string;
  contactName: string;
  description: string;
  dob: string;
  email: string;
  leadSrc: string;
  mobilePhone: string;
  organization: string;
  salutation: string;
  createdTime?: Date;
  creator?: string;
  pk?: number;
  updatedTime?: Date;
}

export interface FilterCriteria {
  assignedTo?: string;
  createdTimeFrom?: object;
  createdTimeTo?: object;
  contactName?: string;
  leadSrc?: string;
  updatedTimeFrom?: object;
  updatedTimeTo?: object;
}
