export interface Authorization {
  authorizationKey: string;
  cardNumber: string;
  amount: number;
  processingDate: string;
  processingTime: string;
  merchantInfo: string;
  processingCode?: string;
  responseCode?: string;
  declineReason?: string;
  isFraud?: boolean;
}
