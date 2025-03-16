
from django.core.management.base import BaseCommand
from faker import Faker  
from ...models import Product, Review, Category
from django.contrib.auth import get_user_model
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates sample products and reviews with random data'

    def handle(self, *args, **kwargs):
        fake = Faker()
        categories = Category.objects.all()

        if not categories.exists():
            self.stdout.write(self.style.WARNING('No categories found. Please create categories first.'))
            return

        
        try:
            reviewer = User.objects.first()  
            if not reviewer:
                raise ValueError("No users found in the database. Please create at least one user.")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
            return

        
        product_names_by_category = {
            "Fresh Produce": ["Organic Bananas", "Fresh Carrots", "Green Kale", "Red Apples", "Sweet Potatoes"],
            "Beverages": ["Cold Brew Coffee", "Sparkling Water", "Orange Juice", "Herbal Tea", "Energy Drink"],
            "Bakery": ["Whole Wheat Bread", "Gluten-Free Muffins", "Croissants", "Bagels", "Sourdough Loaf"],
            "Wine & Spirits": ["Chardonnay Wine", "Cabernet Sauvignon", "Vodka", "Whiskey", "Gin"],
            "Fruits": ["Mangoes", "Strawberries", "Blueberries", "Pineapples", "Pomegranates"],
            "Snacks": ["Potato Chips", "Trail Mix", "Chocolate Bars", "Popcorn", "Granola Bars"],
            "Meat": ["Chicken Breast", "Ground Beef", "Pork Chops", "Lamb Leg", "Turkey Slices"],
            "Seafood": ["Salmon Fillets", "Shrimp", "Tuna Steaks", "Cod Fish", "Scallops"],
        }

        
        for category in categories:
            product_names = product_names_by_category.get(category.name, [])
            for name in product_names:
                price = round(random.uniform(1.0, 20.0), 2)
                rating = round(random.uniform(3.5, 5.0), 1)
                description = fake.paragraph(nb_sentences=3)
                image = f"https://example.com/images/{name.lower().replace(' ', '-')}.jpg"

                
                weight = f"{random.randint(100, 1000)}g"
                origin = fake.country()
                organic = random.choice([True, False])
                storage = random.choice(["Refrigerate after opening", "Store in a cool, dry place"])

                nutrition = {
                    "calories": f"{random.randint(50, 300)} kcal per 100g",
                    "protein": f"{random.randint(1, 10)}g",
                    "carbs": f"{random.randint(5, 30)}g",
                    "fat": f"{random.randint(1, 15)}g",
                    "fiber": f"{random.randint(1, 5)}g",
                }

                
                product = Product.objects.create(
                    name=name,
                    price=price,
                    rating=rating,
                    description=description,
                    image=image,
                    category=category,
                    weight=weight,
                    origin=origin,
                    organic=organic,
                    storage=storage,
                    nutrition=nutrition,
                )

                
                for _ in range(random.randint(1, 5)):  
                    review_rating = random.randint(1, 5)
                    review_comment = fake.paragraph(nb_sentences=2)
                    upvotes = random.randint(0, 100)
                    downvotes = random.randint(0, 50)

                    Review.objects.create(
                        product=product,
                        user=reviewer,  
                        rating=review_rating,
                        comment=review_comment,
                        upvotes=upvotes,
                        downvotes=downvotes,
                    )

        self.stdout.write(self.style.SUCCESS('Successfully created sample products and reviews'))