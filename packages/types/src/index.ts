export * from './enums';

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string; // Masked e.g. 098***1234
  citizenId?: string; // Masked e.g. 036*******89
  role: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface LocationGeoJSON {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
