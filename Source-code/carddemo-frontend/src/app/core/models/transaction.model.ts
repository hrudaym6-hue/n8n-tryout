export interface Transaction {
  transactionId: string;
  cardNumber: string;
  typeId: string;
  categoryCode: string;
  transactionSource: string;
  amount: number;
  description?: string;
  merchantInfo: string;
  processingDate: string;
  processingTime?: string;
}
