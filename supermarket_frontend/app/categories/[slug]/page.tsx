// app/categories/[slug]/page.tsx
import CategoryPageContent from './category-page-content';

interface CategoryParams {
  params: {
    slug: string;
  };
}

// Fetch category data based on the slug
async function getCategoryData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}/`);
  if (!res.ok) {
    throw new Error('Failed to fetch category data');
  }
  return res.json();
}

export default async function CategoryPage({ params }: CategoryParams) {
  const category = await getCategoryData(params.slug);

  return <CategoryPageContent params={params} category={category} />;
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
  const categories = await res.json();

  return categories.map((category: { slug: string }) => ({
    slug: category.slug,
  }));
}