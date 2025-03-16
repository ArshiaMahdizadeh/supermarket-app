'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Eye } from 'lucide-react';

const orders = [
  {
    id: 'ORD-2024-1234',
    customer: 'John Doe',
    date: '2024-03-14',
    total: 29.96,
    status: 'delivered',
    items: [
      {
        name: 'Organic Bananas',
        quantity: 2,
        price: 2.99,
      },
      {
        name: 'Fresh Milk',
        quantity: 1,
        price: 3.49,
      },
    ],
  },
  {
    id: 'ORD-2024-1235',
    customer: 'Jane Smith',
    date: '2024-03-10',
    total: 45.97,
    status: 'processing',
    items: [
      {
        name: 'Whole Grain Bread',
        quantity: 1,
        price: 4.99,
      },
      {
        name: 'Red Wine',
        quantity: 1,
        price: 19.99,
      },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input className="pl-10" placeholder="Search orders..." />
        </div>
        <Select defaultValue="all">
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Customer Information</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.customer}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Order Items</h3>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.name} (x{item.quantity})
                                </span>
                                <span>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}