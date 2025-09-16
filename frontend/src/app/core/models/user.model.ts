import { Account } from './account.model';
export interface User {
  id?: number;
  name: string;
  email: string;
  accounts?: Account[];
}
