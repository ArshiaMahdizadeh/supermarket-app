'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGetOrdersQuery } from '@/lib/api/orderApi'; // Import the RTK Query hook
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Package, Search, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/types/Categories';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch orders from the backend
  const { data: backendOrders = [], isLoading, isError, error } = useGetOrdersQuery({});

  // Transform backend response to match frontend types
  const orders =
    backendOrders?.map((backendOrder: any) => ({
      id: backendOrder.order_id,
      date: backendOrder.created_at,
      total: parseFloat(backendOrder.total),
      status: backendOrder.status,
      items: backendOrder.items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
    })) || [];

  // Filter orders based on search query and status filter
  const filteredOrders =
    orders
      ?.filter((order:Order) => {
        return (
          typeof order.id === 'string' &&
          order.id.toLowerCase().includes(searchQuery?.toLowerCase() || '')
        );
      })
      .filter((order:Order) => {
        return statusFilter === 'all' || order.status === statusFilter;
      }) || [];

  if (isLoading) {
    return <p className="text-center">Loading orders...</p>;
  }

  if (isError) {
    console.error('API Error:', error);
    return <p className="text-red-500 text-center">Failed to load orders.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">View and track your order history</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          defaultValue="all"
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order:Order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(new Date(order.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} items
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-2"
                        aria-label={`Track order ${order.id}`}
                      >
                        Track Order
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6 border-t pt-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No orders found.</p>
        )}
      </div>
    </div>
  );
}