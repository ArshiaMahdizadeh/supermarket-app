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
  Bell,
  Mail,
  Moon,
  Sun,
  Smartphone,
  Globe,
  Shield,
  Key,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [emailSettings, setEmailSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    priceAlerts: true,
  });
  const [pushSettings, setPushSettings] = useState({
    orderUpdates: true,
    chat: true,
    promotions: false,
    system: true,
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Choose what emails you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(emailSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`email-${key}`} className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your {key.toLowerCase()}
                      </p>
                    </div>
                    <Switch
                      id={`email-${key}`}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setEmailSettings((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Manage your mobile and desktop notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(pushSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`push-${key}`} className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about {key.toLowerCase()} on your devices
                      </p>
                    </div>
                    <Switch
                      id={`push-${key}`}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setPushSettings((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how FreshMart looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred theme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4 mr-1" /> Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4 mr-1" /> Dark
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Setup 2FA
                    </Button>
                  </div>
                  <div>
                    <Label className="font-medium">Active Sessions</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Manage your active sessions across devices
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">iPhone 12</div>
                            <div className="text-sm text-muted-foreground">New York, USA</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Chrome Browser</div>
                            <div className="text-sm text-muted-foreground">London, UK</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/24</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                  <Button className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Billing History
                </CardTitle>
                <CardDescription>
                  View your recent billing history and download invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { date: '2024-03-01', amount: 29.99, status: 'Paid' },
                    { date: '2024-02-01', amount: 29.99, status: 'Paid' },
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          ${bill.amount.toFixed(2)} - {bill.status}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(bill.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}