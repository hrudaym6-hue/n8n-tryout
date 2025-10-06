export interface Authorization {
  auth_id: number;
  account_id: number;
  card_number: string;
  transaction_amount: number;
  merchant_id: string;
  merchant_name: string;
  merchant_city: string;
  merchant_zip: string;
  auth_date: string;
  auth_time: string;
  response_code: string;
  approved_amount: number;
  reason_code: string;
  approved?: boolean;
  created_at: string;
}

export interface AuthorizationListResponse {
  authorizations: Authorization[];
  total: number;
  page: number;
  limit: number;
}
