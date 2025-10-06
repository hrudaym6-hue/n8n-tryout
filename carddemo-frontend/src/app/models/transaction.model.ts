export interface Transaction {
  transaction_id: string;
  account_id: number;
  card_number: string;
  transaction_type_code: string;
  transaction_category_code: string;
  transaction_source: string;
  transaction_description: string;
  transaction_amount: number;
  merchant_id: string;
  merchant_name: string;
  merchant_city: string;
  merchant_zip: string;
  origin_date: string;
  process_date: string;
  type_description?: string;
  category_description?: string;
  created_at: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionType {
  type_code: string;
  type_description: string;
  created_at: string;
  updated_at: string;
}
