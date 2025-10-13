export interface Transaction {
  transactionId: string;
  accountId: string;
  cardNumber: string;
  transactionTypeCode: string;
  transactionCategoryCode: string;
  transactionSource: string;
  transactionDescription: string;
  transactionAmount: number;
  merchantId: string;
  merchantName: string;
  merchantCity: string;
  merchantZip: string;
  origTransactionDate: string;
  origTransactionTime: string;
  transactionDate: string;
  transactionTime: string;
}

export interface TransactionAddRequest {
  accountId: string;
  cardNumber: string;
  transactionTypeCode: string;
  transactionCategoryCode: string;
  transactionSource: string;
  transactionDescription: string;
  transactionAmount: number;
  merchantId: string;
  merchantName: string;
  merchantCity: string;
  merchantZip: string;
}

export interface TransactionType {
  typeCode: string;
  typeDescription: string;
  description: string;
}
