'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const stats = [
  {
    title: 'Total Sales',
    value: '$12,345',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-500',
  },
  {
    title: 'Active Users',
    value: '1,234',
    change: '+5.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    title: 'Total Orders',
    value: '856',
    change: '-2.3%',
    trend: 'down',
    icon: ShoppingCart,
    color: 'text-orange-500',
  },
  {
    title: 'Products',
    value: '432',
    change: '+8.7%',
    trend: 'up',
    icon: Package,
    color: 'text-purple-500',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <text
                    x={0}
                    y={0}
                    dx={16}
                    dy={16}
                    fill="currentColor"
                    className="text-sm"
                  >
                    Month
                  </text>
                  <text
                    x={0}
                    y={0}
                    dx={-35}
                    dy={16}
                    fill="currentColor"
                    className="text-sm"
                    textAnchor="start"
                    transform="rotate(-90)"
                  >
                    Sales ($)
                  </text>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New order #1234</p>
                    <p className="text-sm text-muted-foreground">
                      2 minutes ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}