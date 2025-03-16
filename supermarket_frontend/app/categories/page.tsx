'use client'


import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useGetCategoriesQuery } from '@/lib/api/categoryApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  // Call the hook without arguments
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>
          <div className="text-red-500">Error loading categories</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gray-100 text-green-500`}>
                      {/* You can replace this with an actual icon if you have one */}
                      <span className="h-6 w-6">🌿</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}