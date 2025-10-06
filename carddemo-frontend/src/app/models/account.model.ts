export interface Account {
  account_id: number;
  customer_id: number;
  account_status: 'Y' | 'N';
  account_open_date: string;
  account_expiry_date: string;
  current_balance: number;
  credit_limit: number;
  cash_credit_limit: number;
  current_cycle_credit: number;
  current_cycle_debit: number;
  group_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountListResponse {
  accounts: Account[];
  total: number;
  page: number;
  limit: number;
}
