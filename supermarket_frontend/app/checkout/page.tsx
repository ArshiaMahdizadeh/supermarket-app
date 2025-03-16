'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {  useGetDeliveryTimesQuery, useCheckoutMutation } from '@/lib/api/orderApi'; // Import hooks
import {useGetCartQuery} from '@/lib/api/cartApi'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { CreditCard, Truck, MapPin, Clock } from 'lucide-react';
import { CartItem } from '@/types/Categories'; // Import centralized types
import { log } from 'console';

// Saved addresses (can also be fetched dynamically)
const savedAddresses = [
  {
    id: 1,
    name: 'Home',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
  {
    id: 2,
    name: 'Office',
    address: '456 Park Ave, Floor 12',
    city: 'New York',
    state: 'NY',
    zip: '10022',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [promoCode, setPromoCode] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Fetch cart items
  const { data: cartData, isLoading: isCartLoading, isError: isCartError } = useGetCartQuery(undefined);

  // Fetch delivery times
  const { data: deliveryTimes, isLoading: isDeliveryTimesLoading, isError: isDeliveryTimesError } =
    useGetDeliveryTimesQuery(undefined);

  // Mutation for checkout
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();

  // Extract cart items and total price
  const cartItems: CartItem[] = cartData?.items || [];
  const totalCartPrice: number = cartData?.total_cart_price || 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }
    if (!deliveryTime) {
      alert('Please select a delivery time.');
      return;
    }

    try {
      setIsCheckingOut(true);

      // Prepare checkout payload
      const payload = {
        address_id: selectedAddress,
        delivery_time: deliveryTime,
        payment_method: paymentMethod,
        promo_code: promoCode,
      };

      // Call the checkout mutation
      const response = await checkout(payload).unwrap();
      console.log(response)

      // Redirect to confirmation page
      router.push(`/checkout/confirmation?order_id=${response.order_id}`);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>

              <RadioGroup
                value={selectedAddress?.toString()}
                onValueChange={(value) => setSelectedAddress(parseInt(value))}
                className="space-y-4"
              >
                {savedAddresses.map((address) => (
                  <div key={address.id} className="flex items-start">
                    <RadioGroupItem
                      value={address.id.toString()}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`address-${address.id}`}
                      className="ml-3 cursor-pointer"
                    >
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-gray-500">
                        {address.address}
                        <br />
                        {address.city}, {address.state} {address.zip}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button variant="outline" className="mt-4">
                Add New Address
              </Button>
            </div>

            {/* Delivery Time */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Delivery Time</h2>
              </div>

              {isDeliveryTimesLoading && (
                <p className="text-gray-500">Loading delivery times...</p>
              )}

              {isDeliveryTimesError && (
                <p className="text-red-500">Failed to load delivery times.</p>
              )}

              {!isDeliveryTimesLoading && !isDeliveryTimesError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliveryTimes?.map((slot: any) => (
                    <button
                      key={slot.id}
                      className={`p-4 rounded-lg border text-left ${
                        deliveryTime === slot.time
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      } ${!slot.available && 'opacity-50 cursor-not-allowed'}`}
                      onClick={() => slot.available && setDeliveryTime(slot.time)}
                      disabled={!slot.available}
                    >
                      <div className="font-medium">{slot.time}</div>
                      <div className="text-sm text-gray-500">
                        {slot.available ? 'Available' : 'Not Available'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="ml-3">
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="ml-3">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Label htmlFor="promoCode">Promo Code</Label>
              </div>
              <Input
                id="promoCode"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 sticky top-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              {isCartLoading && (
                <p className="text-gray-500">Loading cart items...</p>
              )}

              {isCartError && (
                <p className="text-red-500">Failed to load cart items.</p>
              )}

              {!isCartLoading && !isCartError && (
                <>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <div className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </div>
                            <div className="font-medium">
                              ${(item.total_price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${totalCartPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">$5.99</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(totalCartPrice + 5.99).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={isCheckingOut || isCheckoutLoading}
              >
                {isCheckingOut || isCheckoutLoading ? 'Processing...' : 'Place Order'}
              </Button>

              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Delivery within 2-4 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}