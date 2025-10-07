export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  password?: string;
  userType: 'R' | 'A';
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
