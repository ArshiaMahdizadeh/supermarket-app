import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const featuredCategories = [
    {
      name: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Dairy & Eggs',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-primary/90 to-primary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80"
            alt="Fresh groceries"
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Fresh Groceries Delivered to Your Door
            </h1>
            <p className="mt-4 text-xl text-white">
              Shop from our wide selection of fresh produce, dairy, bakery items, and more.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/categories">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Card key={category.name} className="overflow-hidden">
                <Link href={`/categories/${category.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}