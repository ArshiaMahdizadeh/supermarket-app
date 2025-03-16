from rest_framework import serializers
from .models import Product, Review

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'date']

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbs = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'rating', 'description', 'image',
            'weight', 'origin', 'organic', 'storage',
            'calories', 'protein', 'carbs', 'fat', 'fiber',
            'reviews'
        ]

    def get_calories(self, obj):
        return obj.nutrition.get('calories', '')

    def get_protein(self, obj):
        return obj.nutrition.get('protein', '')

    def get_carbs(self, obj):
        return obj.nutrition.get('carbs', '')

    def get_fat(self, obj):
        return obj.nutrition.get('fat', '')

    def get_fiber(self, obj):
        return obj.nutrition.get('fiber', '')

class RelatedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'rating', 'image']
        
        
        
