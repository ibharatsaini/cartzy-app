import React from "react";
import { useCart } from "../contexts/CartContext";
import { formatCurrency } from "../lib/utils";

interface OrderSummaryProps {
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ className = "" }) => {
  const { cart, subtotal, tax, shipping, total } = useCart();

  if (cart.length === 0) {
    return null;
  }

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 bg-white ${className}`}
    >
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.variant.id} className="flex justify-between">
            <div className="flex items-start">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.variant.image}
                  alt={item.product.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-700">{item.product.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {item.variant.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Qty {item.quantity}
                </p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(item.variant.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium text-gray-900">
            {formatCurrency(shipping)}
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Tax</p>
          <p className="font-medium text-gray-900">{formatCurrency(tax)}</p>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-200">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
