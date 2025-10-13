export interface Card {
  cardNumber: string;
  accountId: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  status: 'Y' | 'N';
  dateCreated?: string;
  dateUpdated?: string;
}
