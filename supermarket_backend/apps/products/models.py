from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.categories.models import Category
from django.contrib.auth import get_user_model

User = get_user_model()

class Product(models.Model):
    """
    Represents a product in the system.
    """
    category = models.ForeignKey(
        Category,
        related_name='products',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=True  
    )
    name = models.CharField(
        max_length=255,
        db_index=True  
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        db_index=True  
    )
    rating = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        db_index=True  
    )
    description = models.TextField()
    image = models.URLField()  
    weight = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    origin = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    organic = models.BooleanField(
        default=False
    )
    storage = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    nutrition = models.JSONField(
        default=dict,  
        blank=True,
        null=True
    )
    is_active = models.BooleanField(
        default=True  
    )

    def delete(self, *args, **kwargs):
        """
        Soft delete the product by setting `is_active` to False.
        """
        self.is_active = False
        self.save()

    def __str__(self):
        return self.name


class Review(models.Model):
    """
    Represents a review for a product.
    """
    product = models.ForeignKey(
        Product,
        related_name='reviews',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    date = models.DateField(
        auto_now_add=True  
    )
    upvotes = models.PositiveIntegerField(
        default=0  
    )
    downvotes = models.PositiveIntegerField(
        default=0  
    )

    @property
    def helpfulness(self):
        """
        Calculate the helpfulness score of the review.
        """
        return self.upvotes - self.downvotes

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"