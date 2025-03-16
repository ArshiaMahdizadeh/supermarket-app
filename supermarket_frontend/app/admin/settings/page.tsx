'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  Mail,
  Bell,
  Shield,
  Users,
  Package,
  Percent,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'FreshMart',
    storeEmail: 'support@freshmart.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Market St, New York, NY 10001',
  });

  const [deliverySettings, setDeliverySettings] = useState({
    minimumOrder: '20',
    deliveryFee: '5.99',
    freeDeliveryThreshold: '50',
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Store settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
                <CardDescription>
                  Update your store details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, storeName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, storeEmail: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={storeSettings.phoneNumber}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={storeSettings.address}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Settings
                </CardTitle>
                <CardDescription>
                  Configure how your inventory is managed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when products are running low
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-reorder</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reorder products when stock is low
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delivery">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Settings
                </CardTitle>
                <CardDescription>
                  Configure delivery options and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder">Minimum Order Amount ($)</Label>
                    <Input
                      id="minimumOrder"
                      type="number"
                      value={deliverySettings.minimumOrder}
                      onChange={(e) =>
                        setDeliverySettings({ ...deliverySettings, minimumOrder: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      value={deliverySettings.deliveryFee}
                      onChange={(e) =>
                        setDeliverySettings({ ...deliverySettings, deliveryFee: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeDelivery">Free Delivery Threshold ($)</Label>
                    <Input
                      id="freeDelivery"
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Delivery Zones
                </CardTitle>
                <CardDescription>
                  Manage delivery areas and restrictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Configure Delivery Zones
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure automated email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Order Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation emails for new orders
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Shipping Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify customers about order status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send promotional emails and newsletters
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Admin Notifications
                </CardTitle>
                <CardDescription>
                  Manage notifications for administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">New Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new orders
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for low inventory
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Admin Access
                </CardTitle>
                <CardDescription>
                  Manage administrator accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Admin Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  );
}