export interface AuthorizationSummary {
  authorizationId: string;
  accountId: string;
  cardNumber: string;
  amount: number;
  merchantName: string;
  merchantCity: string;
  timestamp: string;
  fraudFlag: 'Y' | 'N';
}

export interface AuthorizationDetail {
  authorizationId: string;
  accountId: string;
  cardNumber: string;
  transactionAmount: number;
  merchantId: string;
  merchantName: string;
  merchantCity: string;
  merchantState: string;
  merchantZipCode: string;
  requestTimestamp: string;
  fraudFlag: 'Y' | 'N';
}
