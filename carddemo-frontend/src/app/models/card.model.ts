export interface Card {
  card_number: string;
  account_id: number;
  customer_id: number;
  card_type: string;
  expiry_month: string;
  expiry_year: string;
  cvv_code: string;
  embossed_name: string;
  card_status: 'Y' | 'N';
  is_primary: 'Y' | 'N';
  first_name?: string;
  last_name?: string;
  credit_limit?: number;
  current_balance?: number;
  created_at: string;
  updated_at: string;
}

export interface CardListResponse {
  cards: Card[];
  total: number;
  page: number;
  limit: number;
}
