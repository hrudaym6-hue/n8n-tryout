export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  userType: 'A' | 'R'; // A = Admin, R = Regular
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
