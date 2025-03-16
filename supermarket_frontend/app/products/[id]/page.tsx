"use client";

import { useGetProductQuery } from "@/lib/api/productApi";
import ProductPageContent from "./product-page-content";

interface ProductParams {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductParams) {
  const { data: product, error, isLoading } = useGetProductQuery(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Error Loading Product</h1>
          <p className="text-gray-600">An error occurred while loading the product.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Not Found</h1>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  return <ProductPageContent params={params} product={product} />;
}
