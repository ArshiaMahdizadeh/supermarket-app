'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Minus, Plus, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAddToCartMutation } from '@/lib/api/cartApi'; // Import the mutation hook
import { Product } from '@/types/Categories'; // Import the Product type

// Define props for the component
interface ProductPageContentProps {
  params: { id: string };
  product: Product; // Use the Product type here
}

export default function ProductPageContent({ params, product }: ProductPageContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation(); // Mutation for adding to cart

  // Handle adding the product to the cart
  const handleAddToCart = async () => {
    try {
      await addToCart({
        product_id: product.id,
        quantity: quantity,
      }).unwrap(); // Unwrap to handle success/error states
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{product.rating} out of 5</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900">${product.price}</div>

            <p className="text-gray-600">{product.description}</p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAddingToCart} // Disable button while adding to cart
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                {Object.entries(product.details || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium capitalize">{key}</span>
                    <span>{value.toString()}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="nutrition" className="space-y-4">
                {Object.entries(product.nutrition || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium capitalize">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4">
                {(product.reviews || []).map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                      <span className="text-sm text-gray-500 mt-2 block">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}