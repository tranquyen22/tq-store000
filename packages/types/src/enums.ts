export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  EMPLOYEE = 'employee',
  SHOP_OWNER = 'shop_owner',
  SHOP_STAFF = 'shop_staff',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
}

export enum ShopServiceType {
  FOOD_DRINK = 'food_drink',
  PRODUCT = 'product',
  RENTAL = 'rental',
  SPA_BEAUTY = 'spa_beauty',
}

export enum DriverServiceType {
  BIKE = 'bike',
  TAXI_4S = 'taxi_4s',
  TAXI_7S = 'taxi_7s',
  TAXI_ELECTRIC = 'taxi_electric',
  DELIVERY = 'delivery',
}

export enum OrderStatus {
  PENDING = 'PENDING',        // Chờ xác nhận
  PROCESSING = 'PROCESSING',  // Đang chuẩn bị
  SHIPPED = 'SHIPPED',        // Đang giao
  DELIVERED = 'DELIVERED',    // Đã giao
  CANCELLED = 'CANCELLED',
}

export enum RentalStatus {
  PENDING_DEPOSIT = 'PENDING_DEPOSIT',
  DEPOSITED = 'DEPOSITED',
  IN_USE = 'IN_USE',
  RETURNED_INSPECTED = 'RETURNED_INSPECTED',
  COMPLETED = 'COMPLETED',
}

export enum RideStatus {
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  IN_TRIP = 'IN_TRIP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum WalletType {
  CUSTOMER_WALLET = 'CUSTOMER_WALLET',
  SHOP_WALLET = 'SHOP_WALLET',
  DRIVER_EARNINGS_WALLET = 'DRIVER_EARNINGS_WALLET',
  DRIVER_DEPOSIT_WALLET = 'DRIVER_DEPOSIT_WALLET',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  COMMISSION_DEDUCTION = 'COMMISSION_DEDUCTION',
  REFUND = 'REFUND',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  FINANCIAL_TRANSFER = 'FINANCIAL_TRANSFER',
  LOGIN = 'LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
