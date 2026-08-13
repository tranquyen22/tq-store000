export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}
