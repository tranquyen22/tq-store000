export interface SystemRatesConfig {
  platformCommissionRate: number; // e.g. 15%
  xuCashbackRate: number;         // e.g. 2%
  tqPayDiscountRate: number;      // e.g. 5%
}

export interface MaintenanceConfig {
  isGlobalMaintenance: boolean;
  isVietQrDepositPaused: boolean;
  isWithdrawalPaused: boolean;
  isRentalServicePaused: boolean;
  isTaxiBookingPaused: boolean;
}

export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  permissions: string[];
  isActive: boolean;
}

export interface AuditLogItem {
  id: string;
  operatorName: string;
  operatorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  oldValues?: string;
  newValues?: string;
}
