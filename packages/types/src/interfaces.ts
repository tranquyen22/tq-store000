import { UserRole, ShopServiceType, DriverServiceType, OrderStatus, WalletType, TransactionType } from './enums';

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ShopDTO {
  id: string;
  name: string;
  ownerId: string;
  serviceType: ShopServiceType;
  phone: string;
  address: string;
  provinceCode: string;
  districtCode: string;
  isOpen: boolean;
  rating: number;
}

export interface DriverDTO {
  id: string;
  userId: string;
  serviceType: DriverServiceType;
  vehiclePlate: string;
  isOnline: boolean;
  isAvailable: boolean;
  rating: number;
}

export interface OrderDTO {
  id: string;
  customerId: string;
  shopId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  createdAt: Date;
}

export interface WalletDTO {
  id: string;
  userId: string;
  walletType: WalletType;
  balance: number;
}

export interface WalletTransactionDTO {
  id: string;
  debitWalletId: string;
  creditWalletId: string;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: Date;
}
