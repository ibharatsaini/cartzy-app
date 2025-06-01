import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

import { useOrder } from '../contexts/OrderContext';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import { formatCurrency, formatPhoneNumber, } from '../lib/utils';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const { order } = useOrder();
  console.log(order)

  // Redirect to home if no order exists
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  // Determine status-specific content
  const getStatusContent = () => {
    switch (order.status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500 mb-4" />,
          title: 'Order Confirmed!',
          message: 'Thank you for your purchase. Your order has been confirmed and is being processed.',
          colorClass: 'bg-green-50 border-green-100',
        };
      case 'DECLINED':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500 mb-4" />,
          title: 'Payment Declined',
          message: 'Your payment was declined by your bank. Please check your payment information and try again.',
          colorClass: 'bg-red-50 border-red-100',
        };
      case 'ERROR':
      default:
        return {
          icon: <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />,
          title: 'Payment Processing Error',
          message: 'We encountered an error while processing your payment. Please try again later.',
          colorClass: 'bg-amber-50 border-amber-100',
        };
    }
  };

  const { icon, title, message, colorClass } = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className={`mb-8 p-6 rounded-lg border ${colorClass} text-center`}>
          {icon}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="px-6 py-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Order Details</h3>

            <div className="space-y-6">
              {/* Order Items */}
              <div className="border-b border-gray-200 pb-6">
                {order.items.map((item) => (
                  <div key={item.variant.id} className="flex py-2">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.variant.image}
                        alt={item.product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product.title}</h3>
                          <p className="ml-4">{formatCurrency(item.variant.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.variant.name}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                <address className="not-italic text-sm text-gray-500">
                  <p>{order.customer.fullName}</p>
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </p>
                  <p className="mt-2">
                    {formatPhoneNumber(order.customer.phoneNumber)}
                  </p>
                  <p>{order.customer.email}</p>
                </address>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h3>
                <p className="text-sm text-gray-500">
                  {order.status === 'APPROVED'
                    ? `Paid with card ending in ${order.payment.lastFour}`
                    : 'Payment not completed'}
                </p>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-6">
                <dl className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Subtotal</dt>
                    <dd className="text-gray-900">{formatCurrency(order.payment.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Shipping</dt>
                    <dd className="text-gray-900">{formatCurrency(order.payment.shipping)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Tax</dt>
                    <dd className="text-gray-900">{formatCurrency(order.payment.tax)}</dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-medium">
                    <dt className="text-gray-900">Total</dt>
                    <dd className="text-gray-900">{formatCurrency(order.payment.total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          {order.status !== 'APPROVED' && (
            <Link to="/checkout">
              <Button className="w-full sm:w-auto">
                Try Again
              </Button>
            </Link>
          )}
        </div>

        {/* Email Notification Info */}
        <div className="mt-8 text-center text-sm text-gray-500 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p>
            A confirmation email has been sent to <strong>{order.customer.email}</strong>.
          </p>
          <p className="mt-1">
            (In a real implementation, this would be delivered via Mailtrap.io)
          </p>
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;