import React, { createContext, useContext, useState } from 'react';
import { Order } from '../types';

interface OrderContextType {
  order: Order | null;
  setOrder: (order: Order) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrderState] = useState<Order | null>(null);

  const setOrder = (newOrder: Order) => {
    setOrderState(newOrder);
  };

  const clearOrder = () => {
    setOrderState(null);
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        setOrder,
        clearOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};