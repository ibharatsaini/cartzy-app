import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Lock, Truck } from "lucide-react";

import Header from "../components/Header";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../contexts/CartContext";
import { useOrder } from "../contexts/OrderContext";
import { orderApi } from "../api/order";
import { CustomerDetails, PaymentDetails, TransactionOutcome } from "../types";

// Form validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Invalid expiry date (MM/YY)",
    }),
  cvv: z.string().regex(/^\d{3}$/, { message: "CVV must be 3 digits" }),
  simulateOutcome: z.string().default("1"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, total } = useCart();
  const { setOrder } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      simulateOutcome: "1",
    },
  });

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
    }
  }, [cart, navigate]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);

    try {
      const customerDetails: CustomerDetails = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      };

      const paymentDetails: PaymentDetails = {
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
      };

      const items = cart.map((item) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      const transactionOutcome = parseInt(
        data.simulateOutcome
      ) as TransactionOutcome;

      const orderResponse = await orderApi.createOrder(
        customerDetails,
        paymentDetails,
        items,
        transactionOutcome
      );

      if (orderResponse.success && orderResponse.data) {
        console.log(orderResponse, `order`);
        setOrder(orderResponse.data);
        clearCart();
        navigate("/thank-you");
      } else {

        if (orderResponse.data) {
          setOrder(orderResponse.data);
          navigate("/thank-you");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const transactionOutcome = watch("simulateOutcome");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                    fullWidth
                  />

                  <Input
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    fullWidth
                  />

                  <Input
                    label="Phone Number"
                    placeholder="(123) 456-7890"
                    {...register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                    fullWidth
                  />

                  <Input
                    label="Address"
                    placeholder="123 Main St"
                    {...register("address")}
                    error={errors.address?.message}
                    fullWidth
                  />

                  <Input
                    label="City"
                    placeholder="New York"
                    {...register("city")}
                    error={errors.city?.message}
                    fullWidth
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="State"
                      placeholder="NY"
                      {...register("state")}
                      error={errors.state?.message}
                      fullWidth
                    />

                    <Input
                      label="Zip Code"
                      placeholder="10001"
                      {...register("zipCode")}
                      error={errors.zipCode?.message}
                      fullWidth
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Payment Information
                  </h2>
                </div>

                <div className="flex items-center mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <Lock className="h-4 w-4 mr-2" />
                  Your payment information is encrypted and secure.
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    {...register("cardNumber")}
                    error={errors.cardNumber?.message}
                    maxLength={16}
                    fullWidth
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date (MM/YY)"
                      placeholder="12/25"
                      {...register("expiryDate")}
                      error={errors.expiryDate?.message}
                      maxLength={5}
                      fullWidth
                    />

                    <Input
                      label="CVV"
                      placeholder="123"
                      {...register("cvv")}
                      error={errors.cvv?.message}
                      maxLength={3}
                      fullWidth
                    />
                  </div>
                </div>

                {/* Transaction Simulation */}
                <div className="mt-4 p-3 border border-gray-200 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Simulate Transaction Outcome
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="1"
                        {...register("simulateOutcome")}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={transactionOutcome === "1"}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Approved
                      </span>
                    </label>

                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="2"
                        {...register("simulateOutcome")}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Declined
                      </span>
                    </label>

                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="3"
                        {...register("simulateOutcome")}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Gateway Error
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" isLoading={isProcessing} size="lg">
                  {isProcessing
                    ? "Processing..."
                    : `Pay ${total > 0 ? `$${total.toFixed(2)}` : ""}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummary className="sticky top-24" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
