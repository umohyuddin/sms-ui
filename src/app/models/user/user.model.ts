export interface User {
  id?: number;
  roleId?: number;
  empId?: number;
  cmpId?: number;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  email?: string;
  enabled?: boolean;
  password?: string;
  active?: boolean;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
}
