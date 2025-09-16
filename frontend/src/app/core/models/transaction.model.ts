import { Account } from './account.model';
export type TransactionType = 'deposit' | 'withdrawal';

export interface Transaction {
  id?: number;
  accountId: number;
  type: TransactionType;
  amount: number;
  approvedByManager?: boolean;
  account?: Account;
}
