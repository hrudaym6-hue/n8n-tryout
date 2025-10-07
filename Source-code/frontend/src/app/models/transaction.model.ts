export interface Transaction {
  transactionId: string;
  accountId: string;
  cardNumber: string;
  transactionTypeCode: string;
  transactionCategoryCode: string;
  transactionSource: string;
  transactionDescription: string;
  transactionAmount: number;
  merchantId?: string;
  merchantName?: string;
  merchantCity?: string;
  merchantZipCode?: string;
  originalTransactionDate: string;
  processingDate: string;
}

export interface TransactionListItem {
  transactionId: string;
  transactionDate: string;
  description: string;
  amount: number;
  merchantName: string;
}
