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
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  username?: string;
}
