// Product Types
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  color?: string;
  size?: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  variants: ProductVariant[];
  inventory: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

// Order Types
export interface CustomerDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  payment: {
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    lastFour: string;
  };
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  createdAt: string;
}


export interface SelectedVariant {
    image: string
    price: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Transaction Types
export type TransactionOutcome = 1 | 2 | 3; // 1-Approved, 2-Declined, 3-Gateway Error
export interface TransactionResult {
  success: boolean;
  status: 'approved' | 'declined' | 'error';
  message: string;
  transactionId?: string;
  order?: Order;
}