export interface Authorization {
  authorizationId: string;
  transactionId: string;
  accountId: string;
  cardNumber: string;
  transactionAmount: number;
  amount: number;
  merchantId: string;
  merchantName: string;
  merchantCity: string;
  authTimestamp: string;
  authorizationDate: string;
  authorizationTime: string;
  status: 'A' | 'P' | 'D';
  fraudFlag: 'Y' | 'N';
  responseCode: string;
  approvedAmount: number;
}

export interface AuthorizationUpdateRequest {
  authorizationId: string;
  fraudFlag: 'Y' | 'N';
}
