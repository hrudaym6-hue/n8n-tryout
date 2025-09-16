import { Transaction } from './transaction.model';
import { User } from './user.model';

export type AccountType = 'savings' | 'checking';
export type AccountStatus = 'active' | 'inactive';

export interface Account {
  id?: number;
  userId: number;
  accountNumber: string;
  type: AccountType;
  status: AccountStatus;
  balance: number;
  user?: User;
  transactions?: Transaction[];
}
