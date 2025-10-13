export interface Card {
  cardNumber: string;
  accountId: string;
  cardType: string;
  embossedName: string;
  expirationDate: string;
  cardStatus: string;
  activeStatus: string;
}

export interface CardUpdateRequest {
  cardNumber: string;
  embossedName?: string;
  expirationDate?: string;
  cardStatus?: string;
  activeStatus?: string;
}
