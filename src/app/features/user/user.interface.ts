export interface User {
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  name: string;
  password: string;
  phone: string;
  username: string;
  createdTime?: Date;
  pk?: number;
}
