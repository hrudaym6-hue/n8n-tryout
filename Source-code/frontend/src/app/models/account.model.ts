export interface Account {
  accountId: string;
  accountStatus: string;
  currBalance: number;
  creditLimit: number;
  cashCreditLimit: number;
  openDate: string;
  expiryDate: string;
  reissueDate: string;
  currCycleCredit: number;
  currCycleDebit: number;
  groupId: string;
}

export interface Customer {
  customerId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  governmentId: string;
  creditScore: number;
}

export interface AccountDetail {
  account: Account;
  customer: Customer;
  cards: string[];
}
