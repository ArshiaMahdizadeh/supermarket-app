
from django.core.management.base import BaseCommand
from faker import Faker

from ...models import Category


class Command(BaseCommand):
    help = 'Creates sample categories with random data'

    def handle(self, *args, **kwargs):
        fake = Faker()
        categories = [
            "Fresh Produce", "Beverages", "Bakery", "Wine & Spirits",
            "Fruits", "Snacks", "Meat", "Seafood"
        ]

        for name in categories:
            slug = name.lower().replace(" ", "-")
            description = fake.paragraph(nb_sentences=3)
            image = f"https://example.com/images/{slug}.jpg"  
            Category.objects.create(
                name=name,
                slug=slug,
                description=description,
                image=image
            )

        self.stdout.write(self.style.SUCCESS('Successfully created sample categories'))