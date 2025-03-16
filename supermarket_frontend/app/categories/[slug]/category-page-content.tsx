'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Star, Grid, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetCategoryBySlugQuery } from '@/lib/api/categoryApi'; // Import hooks
import { useAddToCartMutation } from '@/lib/api/cartApi';
import { Category } from '@/types/Categories'; // Import centralized types

interface CategoryPageContentProps {
  params: {
    slug: string;
  };
}

export default function CategoryPageContent({ params }: CategoryPageContentProps) {
  // Fetch category data using the hook
  const { data: category, isLoading, isError } = useGetCategoryBySlugQuery(params.slug);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation(); // Mutation for adding to cart

  // State definitions MUST come before any conditional logic
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('featured');

  // Debugging logs
  console.log("Category Slug:", params.slug);
  console.log("Fetched Category Data:", category);

  // Handle loading state
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 py-16 text-center">Loading...</div>;
  }

  // Handle error state
  if (isError || !category) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <p className="text-red-500">Failed to load category data.</p>
      </div>
    );
  }


  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart({
        product_id: productId,
        quantity: 1,
      }).unwrap(); // Unwrap to handle success/error states
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };
  // Filter products based on price range
  const filteredProducts = category.products.filter(
    (product) => Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {category.name}
              </h1>
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button
                    variant={view === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setView('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setView('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="min-h-screen bg-gray-50 py-16 text-center">
                <p className="text-red-500">No products match the selected filters.</p>
              </div>
            ) : (
              <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className={view === 'grid' ? 'h-48 relative' : 'flex h-48'}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className={view === 'list' ? 'flex justify-between items-start' : ''}>
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                          <div className={view === 'list' ? 'text-right' : 'mt-2'}>
                            <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
                            <Button
                              className="w-full mt-2"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent navigation
                                handleAddToCart(product.id); // Call the addToCart mutation
                              }}
                              disabled={isAddingToCart}
                            >
                              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );



}