'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Truck, MapPin, Clock } from 'lucide-react';

export default function OrderConfirmationPage() {
  const orderNumber = 'ORD-2024-1234';
  const estimatedDelivery = 'Tomorrow, Mar 15, 9:00 AM - 11:00 AM';

  const steps = [
    {
      icon: CheckCircle2,
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and will be processed shortly',
      status: 'completed',
    },
    {
      icon: Package,
      title: 'Order Processed',
      description: 'Your items are being prepared for delivery',
      status: 'current',
    },
    {
      icon: Truck,
      title: 'Out for Delivery',
      description: 'Your order is on its way to you',
      status: 'upcoming',
    },
    {
      icon: MapPin,
      title: 'Delivered',
      description: 'Package has been delivered',
      status: 'upcoming',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you shipping confirmation soon.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Order #{orderNumber}</h2>
                <p className="text-gray-600">Placed on March 14, 2024</p>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0" asChild>
                <Link href="/account/orders">View Order Details</Link>
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-start gap-4"
                  >
                    <div
                      className={`rounded-full p-2 ${
                        step.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : step.status === 'current'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute left-7 h-full border-l border-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Delivery Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="font-medium">Estimated Delivery</div>
                <div className="text-gray-600">{estimatedDelivery}</div>
              </div>
              <div>
                <div className="font-medium">Delivery Address</div>
                <div className="text-gray-600">
                  123 Main St, Apt 4B
                  <br />
                  New York, NY 10001
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Button asChild>
            <Link href="/categories">Continue Shopping</Link>
          </Button>
          <p className="text-sm text-gray-500">
            Need help? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}