export interface Branch {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
}

export interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  isOverdue: boolean;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export interface RentalRecord {
  id: string;
  customerName: string;
  itemName: string;
  depositAmount: number;
  startDate: string;
  returnDate: string;
  preRentalNotes: string;
  postReturnNotes?: string;
  status: 'RENTED' | 'RETURNED' | 'DEPOSIT_REFUNDED';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isOutOfStockToday: boolean;
  options: string[];
}

export interface AIFAQItem {
  id: string;
  question: string;
  answer: string;
}
