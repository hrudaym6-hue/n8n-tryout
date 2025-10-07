export interface Card {
  cardNumber: string;
  cardholderName: string;
  cvvCode: string;
  expirationDate: string;
  accountId: string;
  cardStatus?: string;
  currentBalance?: number;
}

export interface CardListItem {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  balance: number;
}
