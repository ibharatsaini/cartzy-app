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

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  // price: number;
}

export interface CreateOrderDTO {
  customer: CustomerDetails;
  payment: PaymentDetails;
  items: OrderItem[];
}



