export interface BillPayment {
  accountId: string;
  currentBalance: number;
  paymentAmount: number;
  confirmationNumber?: string;
}

export interface BillPaymentRequest {
  accountId: string;
  paymentAmount: number;
}
