export interface Account {
  accountId: string;
  status: string;
  balance: number;
  creditLimit: number;
  customerId: string;
  customerFirstName?: string;
  customerLastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  ssn?: string;
  email?: string;
  dateCreated?: string;
  dateUpdated?: string;
}
