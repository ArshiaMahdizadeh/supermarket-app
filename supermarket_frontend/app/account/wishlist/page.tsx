'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, ShoppingCart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const wishlistItems = [
  {
    id: 1,
    name: 'Organic Bananas',
    price: 2.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Fresh Milk',
    price: 3.49,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400',
  },
];

export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Wishlist</h1>
        <p className="text-muted-foreground">
          Your saved items for later purchase
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input className="pl-10" placeholder="Search wishlist..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <Link
                  href={`/products/${item.id}`}
                  className="block group-hover:text-primary"
                >
                  <h3 className="font-semibold">{item.name}</h3>
                </Link>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-muted-foreground">
                    {item.rating}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wishlistItems.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start saving items you love for later
          </p>
          <Button asChild>
            <Link href="/categories">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}