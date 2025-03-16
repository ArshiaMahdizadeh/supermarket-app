'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { useGetOrderQuery } from '@/lib/api/orderApi'; // Import the RTK Query hook

interface Order {
  order_id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: string;
  contact_info: string;
  timeline: Array<{
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    timestamp: string;
  }>;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: order, isLoading, isError, error } = useGetOrderQuery(params.id);

  if (isLoading) {
    return <p className="text-center">Loading order details...</p>;
  }

  if (isError) {
    console.error('API Error:', error);
    return <p className="text-red-500 text-center">Failed to load order details.</p>;
  }

  if (!order) {
    return <p className="text-red-500 text-center">Order not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order #{params.id}</h1>
          <p className="text-muted-foreground">Track your order status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Order Timeline</h2>
              <div className="relative space-y-8">
                {order.timeline.map((step, index) => {
                  const Icon =
                    step.status === 'completed'
                      ? CheckCircle2
                      : step.status === 'current'
                      ? Truck
                      : Clock;

                  return (
                    <div key={step.title} className="flex gap-4">
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h3 className="font-medium">{step.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="font-medium">Delivery Address</div>
                  <div className="text-muted-foreground">{order.shipping_address}</div>
                </div>
                <div>
                  <div className="font-medium">Contact Information</div>
                  <div className="text-muted-foreground">{order.contact_info}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.99</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-$5.99</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  Contact Support
                </Button>
                <Button className="w-full" variant="outline">
                  Cancel Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}