export interface User {
  userId: string;
  password?: string;
  firstName: string;
  lastName: string;
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
