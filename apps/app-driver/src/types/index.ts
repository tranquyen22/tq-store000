export interface DriverTrip {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  distanceKm: number;
  fareAmount: number;
  netEarnings: number;
  paymentMethod: 'COD' | 'TQ_WALLET' | 'MOMO_QR';
  serviceType: 'CAR_TAXI' | 'BIKE_TAXI' | 'EXPRESS_DELIVERY' | 'FOOD_DELIVERY';
  status: 'SEARCHING' | 'ACCEPTED' | 'DRIVER_ARRIVED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface DriverWalletsState {
  earningsBalance: number; // Ví Thu nhập
  depositBalance: number;  // Ví Ký quỹ
}
