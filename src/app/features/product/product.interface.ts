export interface Product {
  pk?: number;
  name: string;
  price: number;
  isActive: boolean;
  description: string;
  createdTime?: Date;
  updatedTime?: Date;
}
