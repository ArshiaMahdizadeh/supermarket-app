'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Heart } from 'lucide-react';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(
  () => import('@/components/map'),
  { ssr: false }
);

const addresses = [
  {
    id: 1,
    type: 'home',
    name: 'Home',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    isDefault: true,
    coordinates: [40.7128, -74.0060],
  },
  {
    id: 2,
    type: 'work',
    name: 'Office',
    address: '456 Park Ave, Floor 12',
    city: 'New York',
    state: 'NY',
    zip: '10022',
    isDefault: false,
    coordinates: [40.7589, -73.9851],
  },
];

const addressTypes = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'other', label: 'Other', icon: Heart },
];

export default function AddressesPage() {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const AddressIcon = ({ type }: { type: string }) => {
    const iconMap = {
      home: Home,
      work: Briefcase,
      other: Heart,
    };
    const Icon = iconMap[type as keyof typeof iconMap] || MapPin;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Addresses</h1>
          <p className="text-muted-foreground">Manage your delivery addresses</p>
        </div>

        {/* Add New Address Dialog */}
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[1000] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                {/* Address Type Selection */}
                <div>
                  <Label>Address Type</Label>
                  <RadioGroup defaultValue="home" className="grid grid-cols-3 gap-4 mt-2">
                    {addressTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Label
                          key={type.value}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <RadioGroupItem
                            value={type.value}
                            id={type.value}
                            className="sr-only"
                          />
                          <Icon className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Address Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Address Name</Label>
                  <Input id="name" placeholder="e.g., Home, Office" />
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" />
                  </div>
                </div>

                {/* ZIP Code */}
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" />
                </div>

                {/* Map Preview */}
                <div className="h-[200px] rounded-lg overflow-hidden">
                  <Map center={[40.7128, -74.0060]} zoom={13} />
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full">Save Address</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-full ${
                    address.isDefault ? 'bg-primary/10 text-primary' : 'bg-muted'
                  }`}
                >
                  <AddressIcon type={address.type} />
                </div>
                <CardTitle className="flex items-center gap-2">
                  {address.name}
                  {address.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">
                  {address.address}
                  <br />
                  {address.city}, {address.state} {address.zip}
                </p>
              </div>
              <div className="h-[150px] rounded-lg overflow-hidden">
                <Map
                  center={address.coordinates}
                  zoom={15}
                  marker={address.coordinates}
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}