export interface Account {
  accountId: string;
  accountStatus: string;
  accountBalance: number;
  creditLimit: number;
  openDate: string;
  expirationDate: string;
  reissueDate: string;
  currentBalance: number;
  customerId: string;
  groupId: string;
}

export interface AccountUpdateRequest {
  accountId: string;
  accountStatus?: string;
  creditLimit?: number;
  expirationDate?: string;
  reissueDate?: string;
}
